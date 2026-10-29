from pydantic import BaseModel, Field
from typing import List, Optional

class LabTestItem(BaseModel):
    name: str = Field(..., description="Standardized or extracted test name")
    value: str = Field(..., description="Extracted numerical or textual result value")
    unit: str = Field("", description="Measurement unit (e.g., mg/dL, g/dL, %)")
    reference_range: str = Field("", description="Laboratory printed reference interval")
    flag: Optional[str] = Field(None, description="Explicit lab flag if printed, e.g. H, L, High, Low")
    confidence_status: str = Field("verified", description="'verified' or 'review_required'")
    raw_line: Optional[str] = Field(None, description="Original raw line from document")

class DoctorPrescriptionItem(BaseModel):
    medicine_name: str
    raw_snippet: str
    verification_status: str = "review_required"  # "verified", "review_required", "unverified"
    medline_url: Optional[str] = None
    medline_title: Optional[str] = None
    educational_note: Optional[str] = None

class DocumentExtractionResponse(BaseModel):
    tests: List[LabTestItem]
    doctor_prescriptions: List[DoctorPrescriptionItem] = []
    unparsed_lines: List[str] = []
    raw_text: str = ""
    warning: Optional[str] = None

class ExplanationRequest(BaseModel):
    tests: List[LabTestItem]
    language: str = Field("en", description="'en', 'hi', or 'or'")
    allow_cloud_consent: bool = Field(False, description="User explicit consent for OpenAI cloud fallback")

class LabTestExplanation(BaseModel):
    test_name: str
    extracted_value: str
    unit: str
    reference_range: str
    comparison_status: str  # "within_range", "above_range", "below_range", "unspecified"
    comparison_note: str
    what_it_measures: str
    why_ordered: str
    interpretive_limitations: str
    medline_title: str
    medline_url: str
    source_attribution: str = "MedlinePlus, U.S. National Library of Medicine"

class ExplanationResponse(BaseModel):
    explanations: List[LabTestExplanation]
    doctor_prescriptions: List[DoctorPrescriptionItem] = []
    disclaimer: str
    provider_used: str
    provider_label: str

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context_test_names: List[str] = []
    language: str = "en"
    allow_cloud_consent: bool = False

class ChatResponse(BaseModel):
    reply: str
    citations: List[dict] = []
    refused: bool = False
    refusal_reason: Optional[str] = None
    provider_used: str = "local"
    provider_label: str = "Local Educational Engine"

class TerminologyItem(BaseModel):
    term: str
    test_name: str
    abbreviations: List[str] = []
    plain_definition: str
    what_it_measures: str
    why_ordered: str
    common_units: List[str] = []
    limitations: str
    medline_url: str
    medline_title: str
    category: str = "General"

class VerifyMedicineRequest(BaseModel):
    medicine_name: str

class VerifyMedicineResponse(BaseModel):
    medicine_name: str
    verified: bool
    medline_url: Optional[str] = None
    medline_title: Optional[str] = None
    educational_note: str

class HealthStatus(BaseModel):
    status: str
    ollama_available: bool
    ollama_model_available: bool
    configured_model: str
    available_models: List[str]
    gemini_configured: bool
    openai_configured: bool
    allow_cloud_fallback_default: bool
