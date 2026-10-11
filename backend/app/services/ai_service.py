import json
import httpx
import re
from typing import Optional, Tuple
from app.models.schemas import (
    Quest, QuestGenerationRequest, Destination, QuestMode,
    QuestDifficulty, ClueItem, ObservationTask, SocialChallenge,
    CompletionConditions
)
from app.core.config import settings
from app.core.logging import logger
from app.validation.quest_validator import quest_validator



class AIService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER

    async def generate_quest(self, request: QuestGenerationRequest) -> Quest:
        """Generate a validated quest using Ollama, hosted Gemma, or fallback template engine."""
        dest = request.destination

        # 1. Try Ollama if configured
        if self.provider == "ollama" or (self.provider != "fallback" and not settings.HOSTED_GEMMA_ENDPOINT):
            quest = await self._generate_via_ollama(request)
            if quest:
                return quest

        # 2. Try Hosted Gemma endpoint if configured
        if self.provider == "hosted_gemma" or (settings.HOSTED_GEMMA_ENDPOINT and settings.HOSTED_GEMMA_API_KEY):
            quest = await self._generate_via_hosted_gemma(request)
            if quest:
                return quest

        # 3. Deterministic safe fallback
        logger.info(f"Using deterministic fallback template engine for {dest.name}")
        return self.generate_fallback_quest(request)

    async def _generate_via_ollama(self, request: QuestGenerationRequest) -> Optional[Quest]:
        dest = request.destination
        prompt = self._build_prompt(request)

        payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.3,
                "top_p": 0.9,
                "num_predict": 700
            }
        }

        try:
            timeout_cfg = httpx.Timeout(timeout=90.0, connect=4.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:

                res = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json=payload
                )

                if res.status_code == 200:
                    data = res.json()
                    raw_text = data.get("response", "")
                    parsed_json = self._extract_json(raw_text)
                    if parsed_json:
                        parsed_json["ai_generated"] = True
                        parsed_json["model_name"] = f"ollama/{settings.OLLAMA_MODEL}"
                        valid, quest, errors = quest_validator.validate_and_repair_quest(
                            parsed_json, dest, request.mode, request.difficulty
                        )
                        if valid:
                            logger.info(f"Successfully generated quest via Ollama ({settings.OLLAMA_MODEL})")
                            return quest
                        else:
                            logger.warning(f"Ollama quest failed safety validation: {errors}")
        except Exception as e:
            logger.warning(f"Ollama generation failed or timed out: {e}")

        return None

    async def _generate_via_hosted_gemma(self, request: QuestGenerationRequest) -> Optional[Quest]:
        dest = request.destination
        prompt = self._build_prompt(request)

        headers = {
            "Authorization": f"Bearer {settings.HOSTED_GEMMA_API_KEY or ''}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": settings.HOSTED_GEMMA_MODEL,
            "messages": [
                {"role": "system", "content": "You are OffLoop AI Quest Architect. Generate strictly validated JSON adventure quests for real-world public exploration."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    settings.HOSTED_GEMMA_ENDPOINT,
                    headers=headers,
                    json=payload
                )
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        raw_text = choices[0].get("message", {}).get("content", "")
                        parsed_json = self._extract_json(raw_text)
                        if parsed_json:
                            parsed_json["ai_generated"] = True
                            parsed_json["model_name"] = f"hosted/{settings.HOSTED_GEMMA_MODEL}"
                            valid, quest, errors = quest_validator.validate_and_repair_quest(
                                parsed_json, dest, request.mode, request.difficulty
                            )
                            if valid:
                                return quest
        except Exception as e:
            logger.warning(f"Hosted Gemma generation failed: {e}")

        return None

    def _build_prompt(self, request: QuestGenerationRequest) -> str:
        dest = request.destination
        interests = ", ".join(request.user_interests)
        theme = quest_validator.sanitize_input_text(request.custom_theme or "mindful discovery")

        return f"""
Generate an outdoor real-world exploration quest in strict JSON format for this verified destination:
Destination Name: "{dest.name}"
Category: "{dest.category.value}"
Distance: {dest.distance_meters:.1f} meters (~{dest.estimated_walk_minutes} min walk)
Description: "{dest.description or 'Public accessible location'}"
User Interests: {interests}
Quest Mode: {request.mode.value}
Difficulty: {request.difficulty.value}
Theme: {theme}

CRITICAL RULES:
1. ONLY reference the verified destination "{dest.name}". Do NOT hallucinate other locations.
2. The user will pocket their phone and navigate via environmental landmarks, sensory clues, and compass headings.
3. Keep clues safe, on public paths, no trespassing, no night exploration, no forced stranger interactions.
4. Output MUST be a single valid JSON object with this structure:
{{
  "title": "Inspiring 3-5 word title",
  "tagline": "Short evocative catchphrase",
  "narrative_intro": "2 sentence immersive storyline motivating the walk",
  "clues": [
    {{"step": 1, "clue_text": "Landmark-based navigation clue", "hint_type": "landmark"}},
    {{"step": 2, "clue_text": "Direction or environmental clue", "hint_type": "direction"}},
    {{"step": 3, "clue_text": "Sensory observation clue near arrival", "hint_type": "sensory"}}
  ],
  "observation_task": {{
    "prompt": "Specific mindful observation task at the destination",
    "category": "architecture",
    "optional_photo_prompt": "Optional photograph description of public art or tree"
  }},
  "optional_social_challenge": {{
    "prompt": "Optional polite question to ask someone or discuss with a friend",
    "alternative_solo_task": "Solo mindful observation"
  }}
}}
"""

    def _extract_json(self, text: str) -> Optional[dict]:
        try:
            return json.loads(text)
        except Exception:
            pass

        # Try regex extract
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
        return None

    def generate_fallback_quest(self, request: QuestGenerationRequest) -> Quest:
        """Deterministic, safe, high-quality quest template using verified destination data."""
        dest = request.destination

        category_templates = {
            "park": {
                "title": f"The Green Canopy of {dest.name}",
                "tagline": "Follow the rustle of leaves and natural pathways.",
                "intro": f"Break away from the digital current. Take a grounding journey toward {dest.name} and reawaken your senses to the outdoor world.",
                "clues": [
                    ClueItem(step=1, clue_text=f"Orient yourself toward {dest.name}. Notice the changing tree line and open sky.", hint_type="landmark"),
                    ClueItem(step=2, clue_text="Follow the main public pedestrian walkway leading toward the perimeter boundary.", hint_type="direction"),
                    ClueItem(step=3, clue_text="Find the shaded pathway or open green lawn within the park grounds.", hint_type="sensory")
                ],
                "obs_prompt": "Identify the oldest or most distinctive tree in view and observe the pattern of its bark.",
                "obs_cat": "nature",
                "photo_prompt": "Take a photo of tree branches silhouetted against the open sky."
            },
            "garden": {
                "title": f"Botanical Respite at {dest.name}",
                "tagline": "Discover quiet foliage and blooming corners.",
                "intro": f"Leave the screen behind for a tranquil stroll into {dest.name}. Tune into the colors, textures, and subtle fragrances of nature.",
                "clues": [
                    ClueItem(step=1, clue_text=f"Head toward {dest.name}, keeping an eye out for curated floral beds and hedges.", hint_type="landmark"),
                    ClueItem(step=2, clue_text="Locate the pedestrian entryway or garden gate.", hint_type="direction"),
                    ClueItem(step=3, clue_text="Follow the stone or gravel path to the central seating or floral display.", hint_type="sensory")
                ],
                "obs_prompt": "Spot three distinct plant leaf shapes and notice the sunlight filtering through them.",
                "obs_cat": "nature",
                "photo_prompt": "Capture a macro photo of an interesting flower or leaf texture."
            },
            "historic": {
                "title": f"Chronicles of {dest.name}",
                "tagline": "Uncover the tangible echoes of history in your neighborhood.",
                "intro": f"Step into the past. Journey to {dest.name} and observe the architectural craftsmanship and cultural memory embedded in stone.",
                "clues": [
                    ClueItem(step=1, clue_text=f"Walk in the direction of {dest.name}. Look for classical masonry or aged stone features.", hint_type="landmark"),
                    ClueItem(step=2, clue_text="Approach the main facade or historical marker.", hint_type="direction"),
                    ClueItem(step=3, clue_text="Search for an inscription, foundational date, or commemorative emblem.", hint_type="riddle")
                ],
                "obs_prompt": "Read the historical inscription or study the foundation stonework.",
                "obs_cat": "history",
                "photo_prompt": "Photograph the commemorative plaque or architectural cornice."
            },
            "public_square": {
                "title": f"The Civic Pulse: {dest.name}",
                "tagline": "Experience the vibrant heart of the public realm.",
                "intro": f"Immerse yourself in community life. Walk to {dest.name} to observe the rhythms of people, open architecture, and urban flow.",
                "clues": [
                    ClueItem(step=1, clue_text=f"Navigate towards {dest.name}. Look for the widening streetscape and open plaza paving.", hint_type="landmark"),
                    ClueItem(step=2, clue_text="Head toward the central gathering point or plaza sculpture.", hint_type="direction"),
                    ClueItem(step=3, clue_text="Stand at the center of the square and notice the ambient acoustic reflection of the space.", hint_type="sensory")
                ],
                "obs_prompt": "Observe the surrounding architectural facades and the flow of pedestrians.",
                "obs_cat": "architecture",
                "photo_prompt": "Photograph the wide open view across the public plaza."
            }
        }

        template = category_templates.get(dest.category.value, category_templates["park"])

        social = None
        if request.mode == QuestMode.SOCIAL_EXPLORER:
            social = SocialChallenge(
                prompt=f"Ask a passerby or local visitor what their favorite thing about {dest.name} is, or share a brief friendly greeting.",
                is_voluntary=True,
                alternative_solo_task=f"Reflect on how public spaces like {dest.name} connect people across the community."
            )

        duration = max(15, dest.estimated_walk_minutes + 12)

        return Quest(
            id=f"quest_fallback_{dest.id}",
            destination_id=dest.id,
            destination_name=dest.name,
            destination_latitude=dest.latitude,
            destination_longitude=dest.longitude,
            title=template["title"],
            tagline=template["tagline"],
            narrative_intro=template["intro"],
            mode=request.mode,
            difficulty=request.difficulty,
            estimated_duration_minutes=duration,
            starting_instruction=f"Pocket your phone, breathe in the fresh air, and begin walking toward {dest.name}.",
            clues=template["clues"],
            observation_task=ObservationTask(
                prompt=template["obs_prompt"],
                category=template["obs_cat"],
                optional_photo_prompt=template["photo_prompt"]
            ),
            optional_social_challenge=social,
            completion_conditions=CompletionConditions(
                arrival_radius_meters=35.0,
                requires_gps_verification=True
            ),
            safety_guidance=[
                "Stay aware of pedestrian crossings and vehicular traffic.",
                "Stick to well-lit public paths and sidewalks.",
                "Respect the tranquility of public grounds and other visitors."
            ],
            xp_reward=120,
            ai_generated=False,
            model_name="deterministic-template-engine"
        )


ai_service = AIService()
