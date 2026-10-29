import pytest
import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.services.ai_provider import ai_provider_manager

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "ollama_available" in data
    assert "gemini_configured" in data

def test_image_upload_without_consent_does_not_call_gemini(monkeypatch):
    called = False

    async def fail_if_called(_image):
        nonlocal called
        called = True
        raise AssertionError("Gemini must not receive the image without consent")

    monkeypatch.setattr(ai_provider_manager.gemini, "extract_image_results", fail_if_called)
    image = Image.new("RGB", (100, 100), color="white")
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")

    response = client.post(
        "/api/extract/upload",
        files={"file": ("report.png", image_bytes.getvalue(), "image/png")},
        data={"allow_cloud_consent": "false"}
    )

    assert response.status_code == 200
    assert "cloud consent" in response.json()["warning"]
    assert called is False

def test_image_upload_with_consent_uses_gemini_and_requires_review(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-key")

    async def fake_extract(_image):
        return {
            "tests": [{
                "name": "Hemoglobin",
                "value": "11.2",
                "unit": "g/dL",
                "reference_range": "12-16",
                "flag": "L",
                "raw_line": "Hemoglobin 11.2 g/dL"
            }],
            "raw_text": "Hemoglobin 11.2 g/dL",
            "unparsed_lines": []
        }

    monkeypatch.setattr(ai_provider_manager.gemini, "extract_image_results", fake_extract)
    image = Image.new("RGB", (100, 100), color="white")
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")

    response = client.post(
        "/api/extract/upload",
        files={"file": ("report.png", image_bytes.getvalue(), "image/png")},
        data={"allow_cloud_consent": "true"}
    )

    assert response.status_code == 200
    result = response.json()
    assert result["tests"][0]["confidence_status"] == "review_required"
    assert "compare every field" in result["warning"]

def test_image_upload_reports_when_gemini_finds_no_results(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-key")

    async def fake_extract(_image):
        return {"tests": [], "raw_text": "", "unparsed_lines": []}

    monkeypatch.setattr(ai_provider_manager.gemini, "extract_image_results", fake_extract)
    image = Image.new("RGB", (100, 100), color="white")
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")

    response = client.post(
        "/api/extract/upload",
        files={"file": ("report.png", image_bytes.getvalue(), "image/png")},
        data={"allow_cloud_consent": "true"}
    )

    assert response.status_code == 422
    assert "did not detect any complete lab test results" in response.json()["detail"]

def test_api_terminology():
    res = client.get("/api/terminology?q=creatinine")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    assert items[0]["test_name"] == "Creatinine"

def test_api_sample_reports():
    res = client.get("/api/extract/samples")
    assert res.status_code == 200
    samples = res.json()
    assert "cbc_anemia" in samples
    assert "lipid_thyroid_rx" in samples

def test_api_explain():
    payload = {
        "tests": [
            {
                "name": "Hemoglobin",
                "value": "11.2",
                "unit": "g/dL",
                "reference_range": "12.0 - 16.0",
                "flag": "L"
            }
        ],
        "language": "en",
        "allow_cloud_consent": False
    }
    res = client.post("/api/explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["explanations"]) == 1
    exp = data["explanations"][0]
    assert exp["test_name"] == "Hemoglobin"
    assert exp["comparison_status"] == "below_range"
    assert "MedlinePlus" in exp["source_attribution"]

def test_api_chat_safe_inquiry():
    payload = {
        "messages": [
            {"role": "user", "content": "What does creatinine measure?"}
        ],
        "language": "en",
        "allow_cloud_consent": False
    }
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["refused"] is False
    assert len(data["reply"]) > 10

def test_api_chat_uses_gemini_when_cloud_consent_is_enabled(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-key")

    async def fake_gemini_chat(messages, language):
        assert messages[-1]["content"] == "What does hemoglobin measure?"
        return "Hemoglobin carries oxygen in red blood cells.", []

    monkeypatch.setattr(ai_provider_manager.gemini, "answer_chat", fake_gemini_chat)
    res = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "What does hemoglobin measure?"}],
        "language": "en",
        "allow_cloud_consent": True
    })

    assert res.status_code == 200
    assert res.json()["provider_used"] == "gemini"
    assert "Google Gemini (gemini-3.8-flash)" in res.json()["provider_label"]

def test_api_chat_prohibited_medication():
    payload = {
        "messages": [
            {"role": "user", "content": "What medicine should I take for low hemoglobin?"}
        ],
        "language": "en",
        "allow_cloud_consent": False
    }
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["refused"] is True
    assert "cannot recommend, prescribe, rank, or suggest medicines" in data["reply"]

def test_api_verify_medication():
    res = client.post("/api/medications/verify", json={"medicine_name": "Lisinopril"})
    assert res.status_code == 200
    data = res.json()
    assert data["verified"] is True
    assert "medlineplus.gov" in data["medline_url"]
