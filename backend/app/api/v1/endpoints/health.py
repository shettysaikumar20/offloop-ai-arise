from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Service health check")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ai_provider": settings.AI_PROVIDER
    }

