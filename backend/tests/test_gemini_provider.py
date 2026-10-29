import io

import httpx
import pytest
from PIL import Image

from app.services.gemini_provider import GeminiProvider, GeminiProviderError


class MockGeminiClient:
    def __init__(self, response_payload, status_code=200):
        self.response_payload = response_payload
        self.status_code = status_code

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        return None

    async def post(self, url, headers, json):
        assert url.endswith("/models/gemini-3.8-flash:generateContent")
        assert headers["x-goog-api-key"] == "test-key"
        return httpx.Response(
            self.status_code,
            json={
                "candidates": [{
                    "content": {
                        "parts": [{"text": self.response_payload}]
                    }
                }]
            }
        )


@pytest.mark.asyncio
async def test_gemini_extracts_image_values_as_review_required(monkeypatch):
    output = (
        '{"tests":[{"name":"Hemoglobin","value":"11.2","unit":"g/dL",'
        '"reference_range":"12-16","flag":"L","raw_line":"Hemoglobin 11.2 g/dL"}],'
        '"raw_text":"Hemoglobin 11.2 g/dL","unparsed_lines":[]}'
    )
    monkeypatch.setattr(
        "app.services.gemini_provider.httpx.AsyncClient",
        lambda **kwargs: MockGeminiClient(output)
    )
    image = Image.new("RGB", (100, 100), color="white")
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")

    provider = GeminiProvider(api_key="test-key", model="gemini-3.8-flash")
    result = await provider.extract_image_results(image_bytes.getvalue())

    assert result["tests"] == [{
        "name": "Hemoglobin",
        "value": "11.2",
        "unit": "g/dL",
        "reference_range": "12-16",
        "flag": "L",
        "raw_line": "Hemoglobin 11.2 g/dL",
    }]


@pytest.mark.asyncio
async def test_gemini_chat_maps_assistant_history_to_model_role(monkeypatch):
    output = "Hemoglobin is an oxygen-carrying protein in red blood cells."
    client = MockGeminiClient(output)
    monkeypatch.setattr(
        "app.services.gemini_provider.httpx.AsyncClient",
        lambda **kwargs: client
    )
    provider = GeminiProvider(api_key="test-key", model="gemini-3.8-flash")

    reply, citations = await provider.answer_chat([
        {"role": "assistant", "content": "Welcome"},
        {"role": "user", "content": "What does hemoglobin measure?"},
        {"role": "assistant", "content": "It carries oxygen."},
        {"role": "user", "content": "Where is it found?"},
    ])

    assert reply == output
    assert citations[0]["url"] == "https://medlineplus.gov/lab-tests/"


@pytest.mark.asyncio
async def test_gemini_reports_temporary_overload_after_bounded_retries(monkeypatch):
    monkeypatch.setattr(
        "app.services.gemini_provider.httpx.AsyncClient",
        lambda **kwargs: MockGeminiClient("temporarily unavailable", status_code=503)
    )

    async def skip_wait(_seconds):
        return None

    monkeypatch.setattr("app.services.gemini_provider.asyncio.sleep", skip_wait)
    provider = GeminiProvider(api_key="test-key", model="gemini-3.8-flash")

    with pytest.raises(GeminiProviderError, match="temporarily experiencing high demand"):
        await provider.answer_chat([{"role": "user", "content": "What is hemoglobin?"}])
