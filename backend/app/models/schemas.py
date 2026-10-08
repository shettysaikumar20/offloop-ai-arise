from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal
from datetime import datetime, timezone
from enum import Enum



class DestinationCategory(str, Enum):
    PARK = "park"
    GARDEN = "garden"
    HISTORIC = "historic"
    MONUMENT = "monument"
    PUBLIC_SQUARE = "public_square"
    ARTWORK = "artwork"
    LIBRARY = "library"
    VIEWPOINT = "viewpoint"
    PEDESTRIAN_PLAZA = "pedestrian_plaza"
    NATURE_RESERVE = "nature_reserve"
    OTHER_PUBLIC = "other_public"


class AccessType(str, Enum):
    FREE_PUBLIC = "free_public"
    UNKNOWN_FEE = "unknown_fee"
    ACCESSIBLE_GROUNDS = "accessible_grounds"


class Destination(BaseModel):
    id: str
    osm_id: Optional[str] = None
    name: str
    category: DestinationCategory
    description: Optional[str] = None
    latitude: float
    longitude: float
    distance_meters: float = 0.0
    estimated_walk_minutes: int = 0
    access_type: AccessType = AccessType.FREE_PUBLIC
    is_verified_public: bool = True
    opening_hours: Optional[str] = None
    address: Optional[str] = None
    tags: Dict[str, str] = Field(default_factory=dict)


class ClueItem(BaseModel):
    step: int
    clue_text: str
    hint_type: Literal["landmark", "direction", "sensory", "riddle"] = "landmark"
    unlock_delay_seconds: int = 0


class ObservationTask(BaseModel):
    prompt: str
    category: Literal["architecture", "nature", "history", "art", "signage"]
    optional_photo_prompt: Optional[str] = None


class SocialChallenge(BaseModel):
    prompt: str
    is_voluntary: bool = True
    alternative_solo_task: str


class CompletionConditions(BaseModel):
    arrival_radius_meters: float = 35.0
    requires_gps_verification: bool = True


class QuestMode(str, Enum):
    EXPLORER = "explorer"
    MYSTERY = "mystery"
    SOCIAL_EXPLORER = "social_explorer"


class QuestDifficulty(str, Enum):
    EASY = "easy"
    MODERATE = "moderate"
    CHALLENGING = "challenging"


class Quest(BaseModel):
    id: str
    destination_id: str
    destination_name: str
    destination_latitude: float
    destination_longitude: float
    title: str
    tagline: str
    narrative_intro: str
    mode: QuestMode = QuestMode.EXPLORER
    difficulty: QuestDifficulty = QuestDifficulty.EASY
    estimated_duration_minutes: int
    starting_instruction: str
    clues: List[ClueItem]
    observation_task: ObservationTask
    optional_social_challenge: Optional[SocialChallenge] = None
    completion_conditions: CompletionConditions = Field(default_factory=CompletionConditions)
    safety_guidance: List[str]
    xp_reward: int = 100
    ai_generated: bool = False
    model_name: str = "template-engine"
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())



class QuestGenerationRequest(BaseModel):
    destination: Destination
    user_interests: List[str] = Field(default_factory=lambda: ["nature", "architecture", "history"])
    available_time_minutes: int = Field(default=30, ge=10, le=180)
    walking_distance_max_meters: float = Field(default=2000.0, ge=100.0, le=10000.0)
    difficulty: QuestDifficulty = QuestDifficulty.EASY
    mode: QuestMode = QuestMode.EXPLORER
    custom_theme: Optional[str] = None


class NarrationRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None


class NarrationResponse(BaseModel):
    audio_base64: Optional[str] = None
    format: str = "mp3"
    is_fallback: bool = False
    message: str = "Audio generated successfully"


class SystemCapabilities(BaseModel):
    ai_provider: str
    model_name: str
    ai_available: bool
    osm_available: bool
    voice_narration_available: bool
    supported_modes: List[str]
