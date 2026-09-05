from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ActionItem(BaseModel):
    type: str  # task, meeting, reminder
    title: str
    deadline_or_date: Optional[str] = None
    time: Optional[str] = None
    priority: Optional[str] = "medium"  # high, medium, low
    participants: Optional[str] = None

class ProcessTextRequest(BaseModel):
    text: str

class IntentOutput(BaseModel):
    intent: str  # CREATE_TASK, CREATE_MEETING, CREATE_REMINDER, ASK_QUESTION, GENERAL_CONVERSATION
    response: str
    actions: List[ActionItem] = []
    summary: Optional[str] = None

class VoiceProcessResponse(BaseModel):
    transcript: str
    intent: str
    response_text: str
    actions_created: List[Dict[str, Any]] = []
    audio_url: Optional[str] = None
