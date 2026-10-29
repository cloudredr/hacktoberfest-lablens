from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.safety import SafetyEngine
from app.services.ai_provider import ai_provider_manager
from app.services.gemini_provider import GeminiProviderError

router = APIRouter(prefix="/chat", tags=["Follow-up Educational Chat"])

@router.post("", response_model=ChatResponse)
async def chat_terminology(request: ChatRequest):
    """
    Follow-up educational chat endpoint.
    Strictly answers terminology, abbreviation, and reference range questions.
    Pre-filters and post-filters enforce:
    - Absolute medication recommendation prohibition
    - Diagnostic claim prohibition
    """
    if not request.messages:
        return ChatResponse(
            reply="Please ask a question about medical laboratory terminology.",
            citations=[],
            provider_used="none",
            provider_label="None"
        )

    # 1. Independent Pre-Filter (Input Validation)
    last_user_message = request.messages[-1].content
    is_safe, refusal_msg, refusal_reason = SafetyEngine.inspect_user_prompt(last_user_message)
    if not is_safe:
        return ChatResponse(
            reply=refusal_msg or "This request cannot be fulfilled due to medical safety guidelines.",
            citations=[],
            refused=True,
            refusal_reason=refusal_reason,
            provider_used="safety_layer",
            provider_label="LabLens Safety Engine"
        )

    # 2. Invoke AI Provider Manager
    formatted_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    try:
        reply, citations, p_used, p_label = await ai_provider_manager.chat(
            messages=formatted_messages,
            language=request.language,
            allow_cloud_consent=request.allow_cloud_consent
        )
    except GeminiProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    # 3. Independent Post-Filter (Output Validation)
    is_output_safe, sanitized_reply = SafetyEngine.inspect_and_sanitize_output(reply)

    return ChatResponse(
        reply=sanitized_reply,
        citations=citations,
        refused=not is_output_safe,
        refusal_reason="output_policy_violation" if not is_output_safe else None,
        provider_used=p_used,
        provider_label=p_label
    )
