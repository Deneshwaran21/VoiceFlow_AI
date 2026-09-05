from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=True)  # e.g., "2026-09-05" or "Tomorrow"
    time = Column(String, nullable=True)  # e.g., "10:00 AM"
    participants = Column(String, nullable=True)
    location = Column(String, nullable=True, default="Online / Voice Call")
    status = Column(String, default="scheduled")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
