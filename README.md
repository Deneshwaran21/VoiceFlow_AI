# 🎙️ VoiceFlow AI — Real-Time Intelligent Voice Assistant

> **Tagline:** Speak naturally. AI understands, organizes, and acts.

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Overview

**VoiceFlow AI** is a full-stack, real-time Intelligent Voice Assistant engineered for high-accuracy intent classification, structured action extraction, and voice synthesis. Built for real-world productivity, VoiceFlow AI listens to user speech, transcribes speech to text, classifies structured intents (`CREATE_TASK`, `CREATE_MEETING`, `CREATE_REMINDER`, `ASK_QUESTION`, `GENERAL_CONVERSATION`), automatically extracts action items (deadlines, priorities, participants), persists them to a database, and speaks the AI response back to the user.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     USER SPEAKS     │
                    │    🎙️ Microphone    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     FRONTEND        │
                    │ Next.js / TypeScript│
                    │                     │
                    │ • Voice Recording   │
                    │ • Live Transcript   │
                    │ • AI Response UI    │
                    │ • Action Dashboard  │
                    └──────────┬──────────┘
                               │ Audio / Text
                               ▼
                 ┌──────────────────────────┐
                 │       FASTAPI API        │
                 │                          │
                 │  POST /api/voice/process │
                 └────────────┬─────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
     ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
     │ Speech-to-Text │ │ LLM Engine   │ │ Memory Layer │
     │                │ │              │ │              │
     │ Whisper / STT  │ │ Intent       │ │ Conversation │
     │                │ │ Extraction   │ │ Context      │
     └───────┬────────┘ └──────┬───────┘ └──────────────┘
             │                 │
             │ Transcript      │ Structured JSON
             ▼                 ▼
     ┌──────────────────────────────────────┐
     │         AI ORCHESTRATION LAYER       │
     │                                      │
     │ • Intent Detection                   │
     │ • Task Extraction                    │
     │ • Meeting Detection                  │
     │ • Priority Detection (High/Med/Low)  │
     │ • Date/Time Resolution               │
     └───────────────────┬──────────────────┘
                         │
                         ▼
               ┌─────────────────────┐
               │ ACTION ENGINE      │
               │                     │
               │ 📋 Tasks Storage    │
               │ 📅 Meetings Agenda  │
               │ 💬 Conversation Log │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ TEXT-TO-SPEECH     │
               │                     │
               │ 🔊 AI Voice Reply   │
               └──────────┬──────────┘
```

---

## 🔥 Key Features

1. **🎙️ Real-Time Voice Recording**: Pulsing microphone audio capture with Web Audio API & MediaRecorder.
2. **📝 Speech-to-Text Processing**: Transcribes audio to text via Groq/OpenAI Whisper API with local fallback support.
3. **🧠 LLM Intent Classification**: Classifies prompts into `CREATE_TASK`, `CREATE_MEETING`, `CREATE_REMINDER`, `ASK_QUESTION`, or `GENERAL_CONVERSATION`.
4. **📋 Action Intelligence Extraction**: Extracts task titles, relative deadlines (*"Friday night"*, *"Tomorrow"*), and priorities (*🔥 High*, *🟡 Medium*, *🟢 Low*).
5. **📅 Smart Meetings Agenda**: Automatically extracts meeting titles, dates, times, and participants into a persistent schedule.
6. **💬 Conversational Dialogue**: Switch seamlessly between task creation mode and Q&A mode (*e.g., "Explain RAG in simple words"*).
7. **🔊 Text-to-Speech Output**: Speaks AI responses back aloud in natural human voice using browser SpeechSynthesis.
8. **📊 Action Intelligence Dashboard**: Full CRUD tasks board, filterable priorities, meetings agenda, and real-time analytics.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Web Audio API, SpeechSynthesis API.
- **Backend**: Python 3.13, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2.
- **AI Orchestration**: Groq / Gemini / OpenAI Whisper & LLM APIs (with built-in zero-config heuristic engine).
- **Database**: SQLite (SQLAlchemy ORM).
- **DevOps**: Docker, Docker Compose, Pytest.

---

## 🚦 Quick Start Guide

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+

### 1. Run Backend (FastAPI)
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate
# Activate venv (Linux/macOS)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

### 2. Run Frontend (Next.js)
```bash
# Open new terminal & navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Setup

Run the full stack with Docker Compose:
```bash
docker-compose up --build
```

---

## 🧪 Testing

Run backend test suite:
```bash
cd backend
pytest tests/test_backend.py
```

---

## 💼 Resume Description Points

- **Engineered VoiceFlow AI**, a full-stack real-time voice assistant utilizing **FastAPI**, **Next.js**, **Whisper STT**, and **LLM Intent Classification**.
- **Designed structured action extraction pipeline** parsing natural speech into JSON schemas with date resolution and high/medium/low priority tags.
- **Built persistent storage & dashboard architecture** with SQLAlchemy, SQLite, and filterable Next.js dashboard UI.
