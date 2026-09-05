from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.meeting import Meeting
from app.models.conversation import Conversation

router = APIRouter(prefix="/stats", tags=["Dashboard Analytics"])

@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_tasks = db.query(Task).count()
    completed_tasks = db.query(Task).filter(Task.completed == True).count()
    high_priority_tasks = db.query(Task).filter(Task.priority == "high", Task.completed == False).count()
    total_meetings = db.query(Meeting).count()
    total_interactions = db.query(Conversation).count()

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "high_priority_tasks": high_priority_tasks,
        "total_meetings": total_meetings,
        "total_interactions": total_interactions
    }
