from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, List
from app.core.config import settings
from app.services.document_parser import document_parser
from app.models.schemas import DocumentExtractionResponse, LabTestItem, DoctorPrescriptionItem
from app.services.medline_service import MedlineService
from app.services.ai_provider import ai_provider_manager
from app.services.gemini_provider import GeminiProviderError

router = APIRouter(prefix="/extract", tags=["Document Extraction"])

# Pre-built realistic sample laboratory reports for instant Hacktoberfest testing
SAMPLE_REPORTS = {
    "cbc_anemia": {
        "title": "Complete Blood Count (CBC) Panel",
        "description": "Routine blood count sample demonstrating low hemoglobin and low platelets.",
        "text": """METROPOLITAN DIAGNOSTICS LABORATORY
Patient: Jane Doe | Age: 42 | Sex: Female
Date: 2026-10-15 | Specimen: Whole Blood EDTA

TEST NAME                    RESULT    UNITS      REFERENCE INTERVAL    FLAG
Hemoglobin                   11.2      g/dL       12.0 - 16.0          L
White Blood Cell Count       6.8       10^3/uL    4.5 - 11.0           Normal
Platelets                    135       10^3/uL    150 - 450            L

Notes: Slide review confirmed manual platelet count. Clinical correlation recommended."""
    },
    "metabolic_panel": {
        "title": "Comprehensive Metabolic Panel (CMP)",
        "description": "Metabolic panel with elevated fasting glucose and elevated creatinine.",
        "text": """ADVANCED HEALTH LAB SERVICES
Patient: Robert Smith | Age: 58 | Sex: Male
Date: 2026-10-18 | Specimen: Serum

TEST NAME                    RESULT    UNITS      REFERENCE INTERVAL    FLAG
Fasting Blood Glucose        126       mg/dL      70 - 99              H
Creatinine                   1.5       mg/dL      0.7 - 1.3            High
Blood Urea Nitrogen          24        mg/dL      7 - 20               H
ALT                          32        U/L        7 - 56               Normal"""
    },
    "lipid_thyroid_rx": {
        "title": "Lipid & Thyroid Panel with Doctor Prescription",
        "description": "Cardiovascular screening report accompanied by a physician-authored prescription section.",
        "text": """ST. JUDE CLINICAL LABORATORIES
Patient: Maria Garcia | Age: 61 | Sex: Female
Ordering Physician: Dr. Sarah Jenkins, MD

TEST NAME                    RESULT    UNITS      REFERENCE INTERVAL    FLAG
Total Cholesterol            228       mg/dL      < 200                High
TSH                          5.4       uIU/mL     0.4 - 4.0            H
HbA1c                        6.9       %          4.0 - 5.6            High

Physician Orders / Prescriptions:
Rx: Metformin 500mg oral tablet - Take 1 tablet twice daily with meals
Rx: Atorvastatin 20mg oral tablet - Take 1 tablet daily at bedtime"""
    }
}

@router.get("/samples")
async def get_sample_reports():
    """Returns sample report templates for instant testing."""
    return SAMPLE_REPORTS

@router.post("/sample/{sample_id}", response_model=DocumentExtractionResponse)
async def load_sample_report(sample_id: str):
    """Parses and extracts structured tests from a pre-configured sample report."""
    if sample_id not in SAMPLE_REPORTS:
        raise HTTPException(status_code=404, detail="Sample report not found")
    sample_text = SAMPLE_REPORTS[sample_id]["text"]
    return document_parser.parse_report_text(sample_text)

@router.post("/upload", response_model=DocumentExtractionResponse)
async def upload_document(
    file: UploadFile = File(...),
    allow_cloud_consent: bool = Form(False)
):
    """
    Ingests and parses uploaded PDF, PNG, or JPEG documents.
    Extracts laboratory test names, values, units, reference intervals,
    and doctor prescription notes into a structured format for user review.
    """
    # 1. Validate file extension
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Supported formats are: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # 2. Read bytes and check size
    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    extracted_text = ""
    warning = None

    if ext == "pdf":
        try:
            extracted_text = document_parser.extract_text_from_pdf(contents)
            if not extracted_text.strip():
                warning = "No selectable text was found in the PDF. It may be a scanned image."
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to parse PDF document: {str(e)}")
    else:
        if allow_cloud_consent:
            if not settings.GEMINI_API_KEY:
                raise HTTPException(
                    status_code=503,
                    detail="Gemini is not configured. Add GEMINI_API_KEY to the project .env file and restart the backend."
                )
            try:
                gemini_result = await ai_provider_manager.gemini.extract_image_results(contents)
            except GeminiProviderError as exc:
                raise HTTPException(status_code=502, detail=str(exc)) from exc

            tests = [
                LabTestItem(
                    name=item["name"],
                    value=item["value"],
                    unit=item["unit"],
                    reference_range=item["reference_range"],
                    flag=item["flag"] or None,
                    confidence_status="review_required",
                    raw_line=item.get("raw_line") or None
                )
                for item in gemini_result["tests"]
            ]
            if not tests:
                raise HTTPException(
                    status_code=422,
                    detail=(
                        "Gemini did not detect any complete lab test results in this image. "
                        "Try a sharper, well-lit image that includes the full result table, "
                        "or enter the results manually."
                    )
                )
            raw_text = gemini_result["raw_text"]
            return DocumentExtractionResponse(
                tests=tests,
                doctor_prescriptions=document_parser.parse_doctor_prescriptions(raw_text),
                unparsed_lines=gemini_result["unparsed_lines"],
                raw_text=raw_text,
                warning=(
                    "Gemini extracted these values from the uploaded image. "
                    "AI extraction can be wrong: compare every field with the original report before continuing. "
                    "The image was sent to Google Gemini because cloud consent is enabled."
                )
            )

        # Local OCR is not configured; do not send the image to a cloud provider without consent.
        extracted_text, warning = "", (
            "Image text recognition requires Gemini cloud processing. "
            "Open AI Settings and enable cloud consent to send this image to Google Gemini."
        )

    if not extracted_text.strip():
        # Provide empty structured response with appropriate warning
        return DocumentExtractionResponse(
            tests=[],
            doctor_prescriptions=[],
            unparsed_lines=[],
            raw_text="",
            warning=warning or "No text could be extracted. Please enter your test values manually."
        )

    response = document_parser.parse_report_text(extracted_text)
    response.warning = warning
    return response

@router.post("/manual", response_model=DocumentExtractionResponse)
async def manual_text_extraction(payload: Dict[str, str]):
    """
    Accepts manually typed or pasted report text.
    """
    raw_text = payload.get("text", "")
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Text payload cannot be empty.")
    return document_parser.parse_report_text(raw_text)
