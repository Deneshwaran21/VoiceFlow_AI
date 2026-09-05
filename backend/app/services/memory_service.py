from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from typing import List, Dict

class MemoryService:
    @staticmethod
    def get_recent_history(db: Session, limit: int = 5) -> List[Dict[str, str]]:
        recent_conversations = (
            db.query(Conversation)
            .order_by(Conversation.id.desc())
            .limit(limit)
            .all()
        )
        history = []
        for conv in reversed(recent_conversations):
            history.append({"role": "user", "content": conv.user_speech})
            history.append({"role": "assistant", "content": conv.ai_response})
        return history
