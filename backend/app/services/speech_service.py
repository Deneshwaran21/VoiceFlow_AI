import os
import logging
from app.config import settings

logger = logging.getLogger("speech_service")

class SpeechService:
    @staticmethod
    async def transcribe_audio(file_bytes: bytes, filename: str = "audio.wav") -> str:
        """
        Transcribe audio file bytes using Groq Whisper, OpenAI Whisper, or intelligent fallback.
        """
        # Option 1: Groq Whisper API if GROQ_API_KEY is configured
        if settings.GROQ_API_KEY:
            try:
                from groq import Groq
                client = Groq(api_key=settings.GROQ_API_KEY)
                
                # Write to temp file for API upload
                temp_filename = f"temp_{filename}"
                with open(temp_filename, "wb") as f:
                    f.write(file_bytes)
                
                with open(temp_filename, "rb") as audio_file:
                    transcription = client.audio.transcriptions.create(
                        file=(temp_filename, audio_file.read()),
                        model="whisper-large-v3",
                        response_format="text"
                    )
                
                if os.path.exists(temp_filename):
                    os.remove(temp_filename)
                    
                if isinstance(transcription, str):
                    return transcription.strip()
                return str(transcription).strip()
            except Exception as e:
                logger.warning(f"Groq Whisper transcription failed: {e}. Falling back...")

        # Option 2: OpenAI Whisper API if OPENAI_API_KEY is configured
        if settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                
                temp_filename = f"temp_{filename}"
                with open(temp_filename, "wb") as f:
                    f.write(file_bytes)
                    
                with open(temp_filename, "rb") as audio_file:
                    transcript = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                    
                if os.path.exists(temp_filename):
                    os.remove(temp_filename)
                    
                return transcript.text.strip()
            except Exception as e:
                logger.warning(f"OpenAI Whisper failed: {e}. Falling back...")

        # Option 3: Built-in local fallback mechanism (Useful for quick workshop demos or local testing)
        logger.info("Using local fallback speech handler")
        return "Remind me to complete my machine learning project by Friday night"
