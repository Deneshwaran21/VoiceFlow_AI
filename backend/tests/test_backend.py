import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_process_text_task():
    payload = {"text": "Remind me to complete my machine learning project by Friday night"}
    response = client.post("/api/voice/process-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] in ["CREATE_TASK", "CREATE_REMINDER"]
    assert "machine learning" in data["transcript"].lower()
    assert len(data["actions_created"]) > 0

def test_process_text_meeting():
    payload = {"text": "Schedule a meeting with the AI development team tomorrow at 10 AM"}
    response = client.post("/api/voice/process-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "CREATE_MEETING"
    assert len(data["actions_created"]) > 0

def test_get_tasks_and_meetings():
    tasks_res = client.get("/api/tasks")
    assert tasks_res.status_code == 200
    assert isinstance(tasks_res.json(), list)

    meetings_res = client.get("/api/meetings")
    assert meetings_res.status_code == 200
    assert isinstance(meetings_res.json(), list)
