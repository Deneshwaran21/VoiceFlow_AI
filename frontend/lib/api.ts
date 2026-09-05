const API_BASE = "http://localhost:8000/api";

export interface ActionCreated {
  kind: "task" | "meeting";
  id: number;
  title: string;
  deadline?: string;
  date?: string;
  time?: string;
  priority?: string;
}

export interface ProcessVoiceResponse {
  transcript: string;
  intent: string;
  response_text: string;
  actions_created: ActionCreated[];
  audio_url?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  created_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  date?: string;
  time?: string;
  participants?: string;
  location?: string;
  status: string;
  created_at: string;
}

export interface Stats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  high_priority_tasks: number;
  total_meetings: number;
  total_interactions: number;
}

export interface ConversationHistory {
  id: number;
  user_speech: string;
  ai_response: string;
  intent: string;
  detected_action?: string;
  created_at: string;
}

export async function processVoiceAudio(audioBlob: Blob): Promise<ProcessVoiceResponse> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  const res = await fetch(`${API_BASE}/voice/process`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to process voice recording");
  }

  return res.json();
}

export async function processTextPrompt(text: string): Promise<ProcessVoiceResponse> {
  const res = await fetch(`${API_BASE}/voice/process-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to process text input");
  }

  return res.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) return [];
  return res.json();
}

export async function toggleTaskCompleted(taskId: number, completed: boolean): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return res.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  await fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" });
}

export async function fetchMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE}/meetings`);
  if (!res.ok) return [];
  return res.json();
}

export async function deleteMeeting(meetingId: number): Promise<void> {
  await fetch(`${API_BASE}/meetings/${meetingId}`, { method: "DELETE" });
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    return {
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      high_priority_tasks: 0,
      total_meetings: 0,
      total_interactions: 0,
    };
  }
  return res.json();
}

export async function fetchChatHistory(): Promise<ConversationHistory[]> {
  const res = await fetch(`${API_BASE}/chat/history`);
  if (!res.ok) return [];
  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8000/health", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
