from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import SystemCapabilities

router = APIRouter()

@router.get("/config/capabilities", response_model=SystemCapabilities, summary="Get backend system capabilities")
async def get_system_capabilities():
    return SystemCapabilities(
        ai_provider=settings.AI_PROVIDER,
        model_name=settings.OLLAMA_MODEL if settings.AI_PROVIDER == "ollama" else (settings.HOSTED_GEMMA_MODEL or "deterministic"),
        ai_available=True,
        osm_available=True,
        voice_narration_available=bool(settings.ELEVENLABS_API_KEY),
        supported_modes=["explorer", "mystery", "social_explorer"]
    )
