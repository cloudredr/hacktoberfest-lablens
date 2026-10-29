from fastapi import APIRouter
from app.models.schemas import ExplanationRequest, ExplanationResponse, LabTestExplanation
from app.services.safety import SafetyEngine, GLOBAL_MEDICAL_DISCLAIMER
from app.services.ai_provider import ai_provider_manager

router = APIRouter(prefix="/explain", tags=["Report Explanations"])

@router.post("", response_model=ExplanationResponse)
async def explain_laboratory_tests(request: ExplanationRequest):
    """
    Generates plain-language, educational explanations for extracted lab tests.
    Strictly adheres to Medical Safety Rules:
    - Never declares a diagnosis.
    - Never recommends medications.
    - Compares values strictly to printed reference range.
    - Transparently notes which AI provider generated the explanation.
    """
    explanations = []
    overall_provider = "curated"
    overall_label = "Verified MedlinePlus Grounded Knowledge"

    for test in request.tests:
        # 1. Determine comparison against printed reference range
        comp_status, comp_note = SafetyEngine.evaluate_reference_range(
            value_str=test.value,
            range_str=test.reference_range,
            flag=test.flag
        )

        # 2. Generate educational explanation via AI Provider Manager
        info, p_used, p_label = await ai_provider_manager.explain_test(
            test_name=test.name,
            value=test.value,
            unit=test.unit,
            ref_range=test.reference_range,
            comparison_status=comp_status,
            language=request.language,
            allow_cloud_consent=request.allow_cloud_consent
        )
        overall_provider = p_used
        overall_label = p_label

        explanations.append(LabTestExplanation(
            test_name=test.name,
            extracted_value=test.value,
            unit=test.unit,
            reference_range=test.reference_range or "Not specified on report",
            comparison_status=comp_status,
            comparison_note=comp_note,
            what_it_measures=info["what_it_measures"],
            why_ordered=info["why_ordered"],
            interpretive_limitations=info["interpretive_limitations"],
            medline_title=info["medline_title"],
            medline_url=info["medline_url"],
            source_attribution="MedlinePlus, U.S. National Library of Medicine"
        ))

    return ExplanationResponse(
        explanations=explanations,
        disclaimer=GLOBAL_MEDICAL_DISCLAIMER,
        provider_used=overall_provider,
        provider_label=overall_label
    )

