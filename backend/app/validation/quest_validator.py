import re
from typing import Tuple, List
from app.models.schemas import Quest, Destination, QuestMode, QuestDifficulty, ClueItem, ObservationTask, SocialChallenge, CompletionConditions
from app.core.logging import logger

# Safety blacklist keywords for mission validation
UNSAFE_KEYWORDS = [
    "trespass", "climb over", "private property", "restricted area", "railway track", 
    "highway crossing", "night", "dark alley", "rooftop", "construction site",
    "record stranger", "photograph people without permission", "force interaction",
    "confront", "danger", "stealth", "break in", "abandoned building"
]

class QuestValidator:
    @staticmethod
    def sanitize_input_text(text: str) -> str:
        """Sanitize user-provided prompt strings against prompt injection delimiters."""
        if not text:
            return ""
        # Remove markdown code fences and control instructions
        sanitized = re.sub(r"```[a-zA-Z]*", "", text)
        sanitized = re.sub(r"(ignore previous instructions|system prompt|reveal your prompt)", "[filtered]", sanitized, flags=re.IGNORECASE)
        return sanitized.strip()

    @staticmethod
    def validate_and_repair_quest(
        raw_quest: dict,
        target_destination: Destination,
        requested_mode: QuestMode,
        requested_difficulty: QuestDifficulty
    ) -> Tuple[bool, Quest, List[str]]:
        """
        Validate generated quest dictionary against destination ground truth and safety rules.
        If non-critical fields deviate, auto-repair with ground-truth destination values.
        """
        rejection_reasons = []

        # 1. Enforce ground truth destination matching (Anti-hallucination)
        title = raw_quest.get("title", f"Quest to {target_destination.name}").strip()
        tagline = raw_quest.get("tagline", "Discover the subtle details around you.").strip()
        narrative = raw_quest.get("narrative_intro", f"Step away from your screen and take a mindful walk to {target_destination.name}.").strip()

        # 2. Safety text checks
        full_text = f"{title} {tagline} {narrative} {str(raw_quest.get('clues', []))} {str(raw_quest.get('observation_task', {}))}"
        for unsafe in UNSAFE_KEYWORDS:
            if unsafe in full_text.lower():
                rejection_reasons.append(f"Contains safety hazard keyword: '{unsafe}'")

        if rejection_reasons:
            logger.warning(f"Quest validation rejected: {rejection_reasons}")
            return False, None, rejection_reasons

        # 3. Parse and repair Clues
        raw_clues = raw_quest.get("clues", [])
        repaired_clues: List[ClueItem] = []
        if isinstance(raw_clues, list) and len(raw_clues) >= 2:
            for idx, c in enumerate(raw_clues):
                if isinstance(c, dict):
                    text = c.get("clue_text", "").strip()
                    htype = c.get("hint_type", "landmark")
                    if htype not in ["landmark", "direction", "sensory", "riddle"]:
                        htype = "landmark"
                    if text:
                        repaired_clues.append(ClueItem(
                            step=idx + 1,
                            clue_text=text,
                            hint_type=htype,
                            unlock_delay_seconds=c.get("unlock_delay_seconds", idx * 60)
                        ))
                elif isinstance(c, str) and c.strip():
                    repaired_clues.append(ClueItem(
                        step=idx + 1,
                        clue_text=c.strip(),
                        hint_type="landmark",
                        unlock_delay_seconds=idx * 60
                    ))

        if len(repaired_clues) < 2:
            # Fallback default clues
            repaired_clues = [
                ClueItem(step=1, clue_text=f"Begin walking in the direction of {target_destination.name}. Look for prominent landmark trees or architectural features.", hint_type="landmark"),
                ClueItem(step=2, clue_text="As you approach the grounds, locate the main pedestrian entrance or welcome area.", hint_type="direction"),
                ClueItem(step=3, clue_text="Notice the subtle ambient sounds of the environment as you enter the perimeter.", hint_type="sensory")
            ]

        # 4. Parse observation task
        raw_obs = raw_quest.get("observation_task", {})
        obs_prompt = raw_obs.get("prompt") if isinstance(raw_obs, dict) else None
        if not obs_prompt:
            obs_prompt = f"Find and observe an interesting architectural or natural detail at {target_destination.name}."
        
        obs_cat = raw_obs.get("category", "architecture") if isinstance(raw_obs, dict) else "architecture"
        if obs_cat not in ["architecture", "nature", "history", "art", "signage"]:
            obs_cat = "architecture"

        photo_prompt = raw_obs.get("optional_photo_prompt") if isinstance(raw_obs, dict) else None
        if not photo_prompt:
            photo_prompt = f"Take an optional close-up photograph of a non-sensitive public feature or plaque at {target_destination.name}."

        observation_task = ObservationTask(
            prompt=obs_prompt,
            category=obs_cat,
            optional_photo_prompt=photo_prompt
        )

        # 5. Parse social challenge if requested
        social_challenge = None
        if requested_mode == QuestMode.SOCIAL_EXPLORER:
            raw_soc = raw_quest.get("optional_social_challenge", {})
            soc_prompt = raw_soc.get("prompt") if isinstance(raw_soc, dict) else None
            if not soc_prompt:
                soc_prompt = "Politely say hello or ask a local passerby or groundskeeper about the history of this space."
            solo_alt = raw_soc.get("alternative_solo_task", "Read any nearby informational plaque or sign to learn a local fact.") if isinstance(raw_soc, dict) else "Read any nearby informational plaque or sign."
            social_challenge = SocialChallenge(
                prompt=soc_prompt,
                is_voluntary=True,
                alternative_solo_task=solo_alt
            )

        # 6. Safety guidance
        safety_guidance = [
            "Always be mindful of your surroundings and look both ways before crossing roads.",
            "Stay on public sidewalks, designated trails, and pedestrian walkways.",
            "Never trespass on private property or enter closed grounds.",
            "Keep emergency contacts accessible at all times; exit the quest if you feel uncomfortable."
        ]

        # Assemble validated Quest object
        validated_quest = Quest(
            id=f"quest_{target_destination.id}_{int(target_destination.latitude*1000)}",
            destination_id=target_destination.id,
            destination_name=target_destination.name,
            destination_latitude=target_destination.latitude,
            destination_longitude=target_destination.longitude,
            title=title,
            tagline=tagline,
            narrative_intro=narrative,
            mode=requested_mode,
            difficulty=requested_difficulty,
            estimated_duration_minutes=max(15, target_destination.estimated_walk_minutes + 10),
            starting_instruction=f"Pocket your phone, look ahead, and orient your heading toward {target_destination.name}.",
            clues=repaired_clues,
            observation_task=observation_task,
            optional_social_challenge=social_challenge,
            completion_conditions=CompletionConditions(
                arrival_radius_meters=35.0,
                requires_gps_verification=True
            ),
            safety_guidance=safety_guidance,
            xp_reward=100 + (len(repaired_clues) * 20),
            ai_generated=raw_quest.get("ai_generated", True),
            model_name=raw_quest.get("model_name", "gemma")
        )

        return True, validated_quest, []


quest_validator = QuestValidator()
