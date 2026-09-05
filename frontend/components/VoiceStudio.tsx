"use client";

import React, { useState, useRef } from "react";
import { processVoiceAudio, processTextPrompt, ProcessVoiceResponse } from "@/lib/api";
import { speakText, stopSpeaking } from "@/lib/speech";

interface VoiceStudioProps {
  onActionTriggered?: () => void;
}

export default function VoiceStudio({ onActionTriggered }: VoiceStudioProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<ProcessVoiceResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start Mic Recording
  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await handleAudioProcess(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Microphone access denied or not available. Use text prompt below.");
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process Audio Recording Blob
  const handleAudioProcess = async (blob: Blob) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await processVoiceAudio(blob);
      setResult(res);
      triggerSpeech(res.response_text);
      if (onActionTriggered) onActionTriggered();
    } catch (err: any) {
      setErrorMsg(err.message || "Error processing voice recording");
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Direct Text Prompt
  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await processTextPrompt(textInput);
      setResult(res);
      triggerSpeech(res.response_text);
      setTextInput("");
      if (onActionTriggered) onActionTriggered();
    } catch (err: any) {
      setErrorMsg(err.message || "Error processing text prompt");
    } finally {
      setIsProcessing(false);
    }
  };

  // Speak AI Answer aloud using TTS
  const triggerSpeech = (text: string) => {
    setIsSpeaking(true);
    speakText(text, () => setIsSpeaking(false));
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // Sample prompt shortcuts
  const samplePrompts = [
    "Remind me to complete my machine learning project by Friday night",
    "Schedule a meeting with the AI team tomorrow at 10 AM",
    "Explain RAG architecture in simple words",
    "I need to finish the presentation and submit the report ASAP"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Voice Recorder Studio Card */}
      <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden glow-purple">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="mb-4">
          <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Real-Time Speech Processing
          </span>
        </div>

        <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">
          Voice Assistant Studio
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
          Tap the microphone button to speak your intent, tasks, meetings, or questions. AI will extract action items instantly.
        </p>

        {/* Pulse Recording Button */}
        <div className="flex flex-col items-center justify-center my-6">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-pink-600 text-white flex flex-col items-center justify-center shadow-2xl mic-pulse transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="text-3xl">⏹️</span>
              <span className="text-xs font-bold mt-1">STOP</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-all glow-purple cursor-pointer disabled:opacity-50"
            >
              <span className="text-3xl">🎤</span>
              <span className="text-xs font-bold mt-1">SPEAK</span>
            </button>
          )}

          {/* Live Waveform Indicator */}
          {isRecording && (
            <div className="flex items-center space-x-1.5 mt-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full wave-bar"
                  style={{
                    height: `${Math.floor(Math.random() * 24) + 12}px`,
                    animationDelay: `${i * 0.15}s`
                  }}
                ></div>
              ))}
              <span className="ml-3 text-xs text-pink-400 font-semibold animate-pulse">
                Listening to audio...
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center space-x-2 mt-6 text-indigo-300 text-sm font-medium">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Speech & Action Intelligence...</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs max-w-md mx-auto">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Text Input Fallback */}
        <form onSubmit={handleTextSubmit} className="mt-8 max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type prompt e.g., 'Remind me to complete my project by Friday'..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={isProcessing || !textInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {/* Quick Sample Chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextInput(prompt);
                processTextPrompt(prompt).then((res) => {
                  setResult(res);
                  triggerSpeech(res.response_text);
                  if (onActionTriggered) onActionTriggered();
                });
              }}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg transition"
            >
              💡 &quot;{prompt.substring(0, 36)}...&quot;
            </button>
          ))}
        </div>
      </div>

      {/* AI Processing Result Panel */}
      {result && (
        <div className="space-y-4">
          
          {/* Transcript Card */}
          <div className="glass-card rounded-xl p-5 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                📝 Speech Transcript
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {result.intent}
              </span>
            </div>
            <p className="text-white text-base font-medium italic">
              &quot;{result.transcript}&quot;
            </p>
          </div>

          {/* AI Response Card */}
          <div className="glass-card rounded-xl p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
                🤖 AI Response
              </span>
              
              {/* Text-To-Speech Play / Stop button */}
              {isSpeaking ? (
                <button
                  onClick={handleStopSpeech}
                  className="flex items-center space-x-1 text-xs bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg border border-pink-500/30 hover:bg-pink-500/30 transition"
                >
                  <span>⏹️ Stop Voice</span>
                </button>
              ) : (
                <button
                  onClick={() => triggerSpeech(result.response_text)}
                  className="flex items-center space-x-1 text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition"
                >
                  <span>🔊 Speak Answer</span>
                </button>
              )}
            </div>

            <p className="text-gray-200 text-base leading-relaxed">
              {result.response_text}
            </p>
          </div>

          {/* Extracted Action Items */}
          {result.actions_created && result.actions_created.length > 0 && (
            <div className="glass-card rounded-xl p-5 border-l-4 border-emerald-500">
              <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider block mb-3">
                📋 Action Intelligence Triggered
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.actions_created.map((act, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span>{act.kind === "task" ? "📋" : "📅"}</span>
                        <span className="font-semibold text-white">{act.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {act.deadline ? `Due: ${act.deadline}` : act.date ? `Date: ${act.date} at ${act.time}` : ""}
                      </p>
                    </div>
                    {act.priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        act.priority === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {act.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
