from fastapi import APIRouter
from app.models.schemas import NarrationRequest, NarrationResponse
from app.services.narration_service import narration_service

router = APIRouter()

@router.post("/narration/generate", response_model=NarrationResponse, summary="Synthesize spoken quest narration")
async def generate_narration(request: NarrationRequest):
    return await narration_service.synthesize_speech(request.text, request.voice_id)
