from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    date: Optional[str] = None
    time: Optional[str] = None
    participants: Optional[str] = None
    location: Optional[str] = "Online / Voice Call"
    status: Optional[str] = "scheduled"

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
