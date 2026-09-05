from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.voice import ProcessTextRequest, VoiceProcessResponse
from app.services.speech_service import SpeechService
from app.services.llm_service import LLMService
from app.services.action_service import ActionService
from app.services.memory_service import MemoryService

router = APIRouter(prefix="/voice", tags=["Voice Engine"])

@router.post("/process", response_model=VoiceProcessResponse)
async def process_voice_or_text(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Process speech audio recording OR direct text input:
    Audio/Text -> Speech-to-Text -> LLM Intent Parsing -> Action Intelligence -> Database -> Response
    """
    user_prompt = ""
    
    # 1. Speech-To-Text
    if file:
        file_bytes = await file.read()
        user_prompt = await SpeechService.transcribe_audio(file_bytes, filename=file.filename or "recording.wav")
    elif text:
        user_prompt = text.strip()
    else:
        raise HTTPException(status_code=400, detail="Please provide either an audio file or text prompt.")

    if not user_prompt:
        raise HTTPException(status_code=400, detail="Could not extract text from audio.")

    # 2. Retrieve conversation memory
    history = MemoryService.get_recent_history(db, limit=5)

    # 3. LLM Intent & Structured Action Extraction
    intent_output = await LLMService.process_transcript(user_prompt, history)

    # 4. Action Engine Execution & Database Storage
    actions_created = ActionService.execute_actions(db, intent_output, user_prompt)

    return VoiceProcessResponse(
        transcript=user_prompt,
        intent=intent_output.intent,
        response_text=intent_output.response,
        actions_created=actions_created,
        audio_url=None
    )

@router.post("/process-text", response_model=VoiceProcessResponse)
async def process_text_only(
    payload: ProcessTextRequest,
    db: Session = Depends(get_db)
):
    """
    Direct JSON payload endpoint for text testing.
    """
    return await process_voice_or_text(text=payload.text, file=None, db=db)
