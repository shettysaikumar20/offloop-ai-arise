import pytest
from app.services.ai_service import AIService
from app.models.schemas import Destination, DestinationCategory, AccessType, QuestGenerationRequest, QuestMode, QuestDifficulty

@pytest.fixture
def sample_destination():
    return Destination(
        id="dest_botanical_garden",
        name="Lalbagh Glass House",
        category=DestinationCategory.GARDEN,
        description="Historical 19th-century botanical glasshouse surrounded by century-old tropical trees.",
        latitude=12.9507,
        longitude=77.5848,
        distance_meters=1200.0,
        estimated_walk_minutes=18,
        access_type=AccessType.FREE_PUBLIC,
        is_verified_public=True
    )

def test_fallback_quest_generation(sample_destination):
    ai_service = AIService()
    req = QuestGenerationRequest(
        destination=sample_destination,
        user_interests=["nature", "gardens"],
        available_time_minutes=35,
        difficulty=QuestDifficulty.EASY,
        mode=QuestMode.EXPLORER
    )

    quest = ai_service.generate_fallback_quest(req)
    assert quest.destination_name == "Lalbagh Glass House"
    assert quest.destination_id == sample_destination.id
    assert quest.destination_latitude == sample_destination.latitude
    assert quest.destination_longitude == sample_destination.longitude
    assert len(quest.clues) >= 3
    assert quest.observation_task is not None
    assert quest.ai_generated is False
    assert quest.completion_conditions.arrival_radius_meters == 35.0

def test_social_explorer_fallback_quest(sample_destination):
    ai_service = AIService()
    req = QuestGenerationRequest(
        destination=sample_destination,
        user_interests=["history", "conversation"],
        available_time_minutes=45,
        difficulty=QuestDifficulty.MODERATE,
        mode=QuestMode.SOCIAL_EXPLORER
    )

    quest = ai_service.generate_fallback_quest(req)
    assert quest.optional_social_challenge is not None
    assert quest.optional_social_challenge.is_voluntary is True
    assert len(quest.optional_social_challenge.alternative_solo_task) > 0

@pytest.mark.asyncio
async def test_generate_quest_orchestration(sample_destination):
    ai_service = AIService()
    req = QuestGenerationRequest(
        destination=sample_destination,
        user_interests=["architecture"],
        available_time_minutes=25,
        difficulty=QuestDifficulty.EASY,
        mode=QuestMode.EXPLORER
    )

    # Regardless of Ollama server presence, generate_quest must return a valid safe quest (either AI or deterministic fallback)
    quest = await ai_service.generate_quest(req)
    assert quest is not None
    assert quest.destination_name == sample_destination.name
    assert len(quest.safety_guidance) > 0
