from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.conversation import Conversation

router = APIRouter(prefix="/chat", tags=["Conversation History"])

@router.get("/history")
def get_conversation_history(db: Session = Depends(get_db)):
    convs = db.query(Conversation).order_by(Conversation.id.desc()).limit(20).all()
    return convs

@router.delete("/history")
def clear_conversation_history(db: Session = Depends(get_db)):
    db.query(Conversation).delete()
    db.commit()
    return {"message": "Conversation history cleared successfully"}
