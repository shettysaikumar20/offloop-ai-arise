import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "OffLoop AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: str = "*"

    # AI Configuration
    # Supported: "ollama", "hosted_gemma", "fallback"
    AI_PROVIDER: str = "ollama"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma2:2b"

    # Hosted Gemma OpenAI-compatible endpoint (optional)
    HOSTED_GEMMA_ENDPOINT: Optional[str] = None
    HOSTED_GEMMA_API_KEY: Optional[str] = None
    HOSTED_GEMMA_MODEL: str = "google/gemma-2-9b-it"

    # OpenStreetMap / Overpass
    OVERPASS_API_URL: str = "https://overpass-api.de/api/interpreter"
    OVERPASS_TIMEOUT_SECONDS: int = 25
    DESTINATION_CACHE_TTL_MINUTES: int = 60

    # Narration (ElevenLabs proxy)
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
