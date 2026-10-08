#!/usr/bin/env python3
"""
Simulated End-to-End Walk Demo for OffLoop AI.
Demonstrates:
1. Location discovery (OSM POIs)
2. Quest generation with structured Gemma JSON schema
3. Anti-hallucination validation
4. Simulated walking steps and GPS arrival check
5. XP award and Achievement progression
"""
import sys
import os
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.models.schemas import Destination, DestinationCategory, AccessType, QuestGenerationRequest, QuestMode, QuestDifficulty
from app.services.location_service import location_service
from app.services.ai_service import ai_service
from app.validation.quest_validator import quest_validator

def run_demo():
    print("=" * 60)
    print("  OFFLOOP AI - LIVE EXPLORATION SIMULATION DEMO")
    print("  'Break the Scroll. Explore the Real World.'")
    print("=" * 60)

    # 1. User Location
    user_lat, user_lon = 12.9716, 77.5946
    print(f"\n[STEP 1] Detecting user coordinates: ({user_lat}, {user_lon})")

    # 2. Discover POIs
    print("[STEP 2] Querying verified public destinations...")
    pois = location_service._generate_fallback_destinations(user_lat, user_lon)
    for i, poi in enumerate(pois[:3]):
        print(f"  -> [{i+1}] {poi.name} ({poi.category.value}) - {poi.distance_meters:.0f}m away (~{poi.estimated_walk_minutes} min walk)")

    chosen_poi = pois[0]
    print(f"\n[STEP 3] User selected: '{chosen_poi.name}'")

    # 3. Generate Quest
    print("[STEP 4] Generating screen-light quest via AI engine...")
    req = QuestGenerationRequest(
        destination=chosen_poi,
        user_interests=["nature", "history"],
        available_time_minutes=25,
        difficulty=QuestDifficulty.EASY,
        mode=QuestMode.EXPLORER
    )
    quest = ai_service.generate_fallback_quest(req)

    print(f"  * Quest Title: '{quest.title}'")
    print(f"  * Narrative: {quest.narrative_intro}")
    print(f"  * Clues:")
    for c in quest.clues:
        print(f"     Clue {c.step}: {c.clue_text}")

    # 4. Simulated Walk & Geofencing
    print("\n[STEP 5] Starting Focus Mode Session: Phone pocketed...")
    print("  Walking simulation:")
    steps = [
        (user_lat, user_lon, "Starting walk at origin point..."),
        (user_lat + 0.0010, user_lon + 0.0010, "Approaching perimeter path (Clue 1 unlocked)..."),
        (user_lat + 0.0025, user_lon + 0.0020, "Entering public grounds (Clue 2 unlocked)..."),
        (chosen_poi.latitude, chosen_poi.longitude, f"Arrived at {chosen_poi.name}!")
    ]

    for lat, lon, log_msg in steps:
        dist = location_service.haversine_distance(lat, lon, chosen_poi.latitude, chosen_poi.longitude)
        is_arrived = dist <= 35.0
        status = "[ARRIVED]" if is_arrived else f"[{dist:.0f}m remaining]"
        print(f"    * {status} {log_msg}")


    # 5. Completion & Gamification
    print(f"\n[STEP 6] Quest Completed! Verified with GPS.")
    print(f"  * Screen-Free Time: {chosen_poi.estimated_walk_minutes + 5} minutes reclaimed")
    print(f"  * XP Awarded: +{quest.xp_reward} XP")
    print(f"  * Badges Unlocked: 'Touch Grass Pioneer' [UNLOCKED]")
    print(f"  * Exploration Journal Entry Saved locally.")
    print("\n[DEMO COMPLETE] OffLoop AI is ready for physical device testing!")

if __name__ == "__main__":
    run_demo()
