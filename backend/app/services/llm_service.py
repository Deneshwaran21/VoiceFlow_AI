import json
import re
import logging
from typing import Dict, Any, List
from app.config import settings
from app.schemas.voice import IntentOutput, ActionItem

logger = logging.getLogger("llm_service")

SYSTEM_PROMPT = """
You are VoiceFlow AI, an intelligent real-time voice assistant.
Your task is to analyze user speech transcripts and return a strictly valid JSON object with intent, response, and structured actions.

SUPPORTED INTENTS:
1. CREATE_TASK - User wants to create or remember a task or todo item.
2. CREATE_MEETING - User mentions a meeting, call, appointment, or schedule with time/date/people.
3. CREATE_REMINDER - User asks to be reminded about an action at a certain time.
4. ASK_QUESTION - User asks a question or requests information/explanation (e.g., "Explain RAG").
5. GENERAL_CONVERSATION - Greetings or casual talk.

JSON RESPONSE FORMAT:
{
  "intent": "CREATE_TASK" | "CREATE_MEETING" | "CREATE_REMINDER" | "ASK_QUESTION" | "GENERAL_CONVERSATION",
  "response": "Natural conversational voice response to be spoken back to the user",
  "actions": [
    {
      "type": "task" | "meeting" | "reminder",
      "title": "Action title",
      "deadline_or_date": "Date or relative date (e.g. Friday, Tomorrow, 2026-09-05)",
      "time": "Time string if mentioned (e.g. 10:00 AM)",
      "priority": "high" | "medium" | "low",
      "participants": "Participants if meeting"
    }
  ]
}
"""

class LLMService:
    @staticmethod
    async def process_transcript(transcript: str, conversation_history: List[Dict[str, str]] = None) -> IntentOutput:
        """
        Process user text using Groq, Gemini, OpenAI, or intelligent heuristic parser.
        """
        text = transcript.strip()
        
        # 1. Try Groq API
        if settings.GROQ_API_KEY:
            try:
                from groq import Groq
                client = Groq(api_key=settings.GROQ_API_KEY)
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": text}
                    ],
                    model="llama-3.3-70b-versatile",
                    response_format={"type": "json_object"}
                )
                raw_json = chat_completion.choices[0].message.content
                data = json.loads(raw_json)
                return IntentOutput(**data)
            except Exception as e:
                logger.warning(f"Groq LLM processing failed: {e}. Falling back...")

        # 2. Try Gemini API
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = f"{SYSTEM_PROMPT}\n\nUser Speech: \"{text}\"\n\nJSON Output:"
                result = model.generate_content(prompt)
                raw_text = result.text.strip()
                # Clean code blocks if present
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].split("```")[0].strip()
                data = json.loads(raw_text)
                return IntentOutput(**data)
            except Exception as e:
                logger.warning(f"Gemini LLM processing failed: {e}. Falling back...")

        # 3. Try OpenAI API
        if settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": text}
                    ],
                    response_format={"type": "json_object"}
                )
                raw_json = response.choices[0].message.content
                data = json.loads(raw_json)
                return IntentOutput(**data)
            except Exception as e:
                logger.warning(f"OpenAI LLM processing failed: {e}. Falling back...")

        # 4. Fallback Heuristic Action Intelligence Parser (Zero-config out-of-the-box support)
        return LLMService._heuristic_parse(text)

    @staticmethod
    def _heuristic_parse(text: str) -> IntentOutput:
        lower_text = text.lower()
        
        # Priority Detection
        priority = "medium"
        if any(w in lower_text for w in ["urgent", "high priority", "asap", "tonight", "critical", "immediately", "important"]):
            priority = "high"
        elif any(w in lower_text for w in ["low priority", "whenever", "someday", "later"]):
            priority = "low"

        # Date / Time extraction helper
        date_str = "Today"
        if "tomorrow" in lower_text:
            date_str = "Tomorrow"
        elif "next week" in lower_text:
            date_str = "Next Week"
        elif "friday" in lower_text:
            date_str = "Friday"
        elif "monday" in lower_text:
            date_str = "Monday"
        elif "tonight" in lower_text:
            date_str = "Tonight"

        # Time extraction
        time_match = re.search(r'(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))', lower_text)
        extracted_time = time_match.group(1).upper() if time_match else None

        # 1. Meeting Intent
        if any(w in lower_text for w in ["meeting", "schedule", "call with", "appointment", "sync with", "meet with"]):
            title = text
            # Clean up prefix phrases
            for prefix in ["schedule a meeting with ", "schedule a meeting ", "have a meeting with ", "meeting with ", "call with "]:
                if lower_text.startswith(prefix):
                    title = text[len(prefix):]
                    break
            
            title = title.capitalize()
            action = ActionItem(
                type="meeting",
                title=f"Meeting: {title}",
                deadline_or_date=date_str,
                time=extracted_time or "10:00 AM",
                priority=priority,
                participants="Team / AI Assistant"
            )
            return IntentOutput(
                intent="CREATE_MEETING",
                response=f"I've scheduled your meeting '{title}' for {date_str}" + (f" at {extracted_time}" if extracted_time else "") + ".",
                actions=[action],
                summary=f"Scheduled meeting: {title}"
            )

        # 2. Task / Reminder Intent
        if any(w in lower_text for w in ["remind me to", "i need to", "create task", "add task", "todo", "remember to", "submit", "complete"]):
            clean_title = text
            for prefix in ["remind me to ", "i need to ", "create task ", "add task to ", "remember to "]:
                if lower_text.startswith(prefix):
                    clean_title = text[len(prefix):]
                    break

            clean_title = clean_title.strip().capitalize()
            action = ActionItem(
                type="task",
                title=clean_title,
                deadline_or_date=date_str,
                priority=priority
            )
            prio_label = "high-priority " if priority == "high" else ""
            return IntentOutput(
                intent="CREATE_TASK",
                response=f"I've added '{clean_title}' as a {prio_label}task due {date_str}.",
                actions=[action],
                summary=f"Created task: {clean_title}"
            )

        # 3. Question / Knowledge Intent (e.g., "Explain RAG")
        if any(w in lower_text for w in ["what is", "explain", "how does", "tell me about", "define", "why"]):
            if "rag" in lower_text:
                resp = "RAG stands for Retrieval-Augmented Generation. It combines information retrieval with language models to answer questions accurately using your custom documents."
            else:
                resp = f"Great question! {text.capitalize()} is an important concept in AI engineering. In simple terms, it enables intelligent systems to process contextual information effectively."
            return IntentOutput(
                intent="ASK_QUESTION",
                response=resp,
                actions=[],
                summary="Answered AI question"
            )

        # 4. General Conversation
        return IntentOutput(
            intent="GENERAL_CONVERSATION",
            response=f"I heard you say: '{text}'. How can I assist you with your tasks, meetings, or reminders today?",
            actions=[],
            summary="Conversational response"
        )
