from fastapi import APIRouter
from app.services.ai_provider import ai_provider_manager
from app.models.schemas import HealthStatus

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthStatus)
async def get_health():
    """Returns AI Provider connectivity status and model discovery details."""
    data = await ai_provider_manager.check_health()
    return HealthStatus(
        status=data["status"],
        ollama_available=data["ollama_available"],
        ollama_model_available=data["ollama_model_available"],
        configured_model=data["configured_model"],
        available_models=data["available_models"],
        gemini_configured=data["gemini_configured"],
        openai_configured=data["openai_configured"],
        allow_cloud_fallback_default=data["allow_cloud_fallback_default"]
    )
