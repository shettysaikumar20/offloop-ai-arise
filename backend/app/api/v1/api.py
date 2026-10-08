from fastapi import APIRouter
from app.api.v1.endpoints import health, destinations, quests, narration, config

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(destinations.router, tags=["Destinations"])
api_router.include_router(quests.router, tags=["Quests"])
api_router.include_router(narration.router, tags=["Narration"])
api_router.include_router(config.router, tags=["Config"])
