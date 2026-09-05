from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import voice, tasks, meetings, chat, stats
from app.models.task import Task
from app.models.meeting import Meeting

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-Time Voice Assistant with Action Intelligence API"
)

# CORS configuration allowing local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(voice.router, prefix=settings.API_PREFIX)
app.include_router(tasks.router, prefix=settings.API_PREFIX)
app.include_router(meetings.router, prefix=settings.API_PREFIX)
app.include_router(chat.router, prefix=settings.API_PREFIX)
app.include_router(stats.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def seed_sample_data():
    """Seed initial sample tasks & meetings if DB is empty for workshop demo"""
    db = SessionLocal()
    try:
        if db.query(Task).count() == 0:
            sample_tasks = [
                Task(title="Submit GenAI Voice Project", description="Finish machine learning voice assistant", deadline="Tonight", priority="high", completed=False),
                Task(title="Prepare Presentation Deck", description="Create slides for AI team review", deadline="Tomorrow", priority="medium", completed=False),
                Task(title="Learn FastAPI & Whisper", description="Review REST API architecture", deadline="Next Week", priority="low", completed=True)
            ]
            db.add_all(sample_tasks)
            db.commit()

        if db.query(Meeting).count() == 0:
            sample_meetings = [
                Meeting(title="Development Team Sync", date="Tomorrow", time="10:00 AM", participants="Engineering Team", status="scheduled"),
                Meeting(title="AI Project Review", date="Friday", time="03:00 PM", participants="Project Lead & Mentor", status="scheduled")
            ]
            db.add_all(sample_meetings)
            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
