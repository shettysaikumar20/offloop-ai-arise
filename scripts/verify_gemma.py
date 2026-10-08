#!/usr/bin/env python3
"""
Verify Gemma AI generation against local Ollama instance.
"""
import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.models.schemas import Destination, DestinationCategory, AccessType, QuestGenerationRequest, QuestMode, QuestDifficulty
from app.services.ai_service import ai_service
from app.core.config import settings

async def main():
    print(f"=== OffLoop AI - Gemma Model Verification ===")
    print(f"AI Provider: {settings.AI_PROVIDER}")
    print(f"Ollama Base URL: {settings.OLLAMA_BASE_URL}")
    print(f"Target Model: {settings.OLLAMA_MODEL}")
    print("-" * 50)

    sample_dest = Destination(
        id="osm_node_1001",
        name="Lalbagh Botanical Glasshouse",
        category=DestinationCategory.GARDEN,
        description="Historical botanical conservatory surrounded by centuries-old trees.",
        latitude=12.9507,
        longitude=77.5848,
        distance_meters=850.0,
        estimated_walk_minutes=12,
        access_type=AccessType.FREE_PUBLIC,
        is_verified_public=True
    )

    req = QuestGenerationRequest(
        destination=sample_dest,
        user_interests=["nature", "history", "mindfulness"],
        available_time_minutes=30,
        difficulty=QuestDifficulty.EASY,
        mode=QuestMode.EXPLORER
    )

    print(f"Generating quest for: {sample_dest.name}...")
    quest = await ai_service.generate_quest(req)

    print("\n[SUCCESS] Quest Generated & Validated!")

    print(f"Title: {quest.title}")
    print(f"Tagline: {quest.tagline}")
    print(f"Narrative: {quest.narrative_intro}")
    print(f"AI Model: {quest.model_name} (AI Generated: {quest.ai_generated})")
    print(f"Clues Count: {len(quest.clues)}")
    for c in quest.clues:
        print(f"  [{c.step}] ({c.hint_type}) {c.clue_text}")
    print(f"Observation Task: {quest.observation_task.prompt}")
    print(f"Safety Guidance: {quest.safety_guidance}")
    print(f"XP Reward: {quest.xp_reward}")

if __name__ == "__main__":
    asyncio.run(main())
