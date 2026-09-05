from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.schemas.voice import IntentOutput
from app.models.task import Task
from app.models.meeting import Meeting
from app.models.conversation import Conversation

class ActionService:
    @staticmethod
    def execute_actions(db: Session, intent_output: IntentOutput, user_speech: str) -> List[Dict[str, Any]]:
        created_records = []
        
        for action in intent_output.actions:
            if action.type in ["task", "reminder"]:
                db_task = Task(
                    title=action.title,
                    description=f"Extracted from voice prompt: '{user_speech}'",
                    deadline=action.deadline_or_date or "No deadline",
                    priority=action.priority or "medium",
                    completed=False
                )
                db.add(db_task)
                db.commit()
                db.refresh(db_task)
                created_records.append({
                    "kind": "task",
                    "id": db_task.id,
                    "title": db_task.title,
                    "deadline": db_task.deadline,
                    "priority": db_task.priority
                })
            
            elif action.type == "meeting":
                db_meeting = Meeting(
                    title=action.title,
                    date=action.deadline_or_date or "Tomorrow",
                    time=action.time or "10:00 AM",
                    participants=action.participants or "Team",
                    status="scheduled"
                )
                db.add(db_meeting)
                db.commit()
                db.refresh(db_meeting)
                created_records.append({
                    "kind": "meeting",
                    "id": db_meeting.id,
                    "title": db_meeting.title,
                    "date": db_meeting.date,
                    "time": db_meeting.time
                })
                
        # Save to Conversation History
        action_summary = ", ".join([r["title"] for r in created_records]) if created_records else "None"
        conv = Conversation(
            user_speech=user_speech,
            ai_response=intent_output.response,
            intent=intent_output.intent,
            detected_action=action_summary
        )
        db.add(conv)
        db.commit()

        return created_records
