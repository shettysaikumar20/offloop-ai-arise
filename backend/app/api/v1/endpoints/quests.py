from fastapi import APIRouter, HTTPException
from app.models.schemas import Quest, QuestGenerationRequest
from app.services.ai_service import ai_service
from app.validation.quest_validator import quest_validator

router = APIRouter()

@router.post("/quests/generate", response_model=Quest, summary="Generate AI adventure quest for destination")
async def generate_quest(request: QuestGenerationRequest):
    try:
        quest = await ai_service.generate_quest(request)
        return quest
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quest generation error: {str(e)}")


@router.post("/quests/fallback", response_model=Quest, summary="Generate deterministic fallback quest")
async def generate_fallback_quest(request: QuestGenerationRequest):
    return ai_service.generate_fallback_quest(request)


@router.post("/quests/validate", summary="Validate a raw quest against safety constraints")
async def validate_quest(raw_quest: dict, target_destination: dict, mode: str = "explorer", difficulty: str = "easy"):
    from app.models.schemas import Destination, QuestMode, QuestDifficulty
    dest = Destination.model_validate(target_destination)
    valid, quest, errors = quest_validator.validate_and_repair_quest(
        raw_quest, dest, QuestMode(mode), QuestDifficulty(difficulty)
    )
    return {
        "is_valid": valid,
        "errors": errors,
        "quest": quest.model_dump() if quest else None
    }
