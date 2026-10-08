import httpx
import base64
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import NarrationResponse


class NarrationService:
    async def synthesize_speech(self, text: str, voice_id: Optional[str] = None) -> NarrationResponse:
        """Synthesize narration via ElevenLabs API if key is set, otherwise return fallback hint for native Android TTS."""
        api_key = settings.ELEVENLABS_API_KEY
        selected_voice = voice_id or settings.ELEVENLABS_VOICE_ID

        if not api_key:
            logger.info("ElevenLabs API key not configured. Client will use native Android Text-to-Speech.")
            return NarrationResponse(
                audio_base64=None,
                format="tts_native",
                is_fallback=True,
                message="ElevenLabs not configured; use Android device native TTS."
            )

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice}"
        headers = {
            "xi-api-key": api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text[:500],  # Keep spoken hints punchy
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.75,
                "similarity_boost": 0.75
            }
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    b64_audio = base64.b64encode(res.content).decode("utf-8")
                    return NarrationResponse(
                        audio_base64=b64_audio,
                        format="mp3",
                        is_fallback=False,
                        message="ElevenLabs audio generated successfully."
                    )
                else:
                    logger.warning(f"ElevenLabs error {res.status_code}: {res.text}")
        except Exception as e:
            logger.warning(f"ElevenLabs synthesis request failed: {e}")

        return NarrationResponse(
            audio_base64=None,
            format="tts_native",
            is_fallback=True,
            message="Falling back to Android native TTS."
        )


narration_service = NarrationService()
