"use client";

import React, { useState, useEffect } from "react";
import { ConversationHistory, fetchChatHistory } from "@/lib/api";

export default function ChatHistory() {
  const [history, setHistory] = useState<ConversationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchChatHistory();
    setHistory(data);
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💬</span> Voice Interaction History
          </h2>
          <p className="text-xs text-gray-400">Chronological history of voice & text dialogue sessions</p>
        </div>
        <button
          onClick={loadHistory}
          className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg transition border border-white/10"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No past voice conversations recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="glass-card rounded-xl p-4 space-y-3 border-l-2 border-indigo-500">
              
              {/* User Prompt */}
              <div className="flex items-start space-x-3">
                <span className="text-sm bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg">🎙️</span>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">User Voice Prompt</span>
                  <p className="text-sm font-medium text-white italic">&quot;{item.user_speech}&quot;</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start space-x-3 pt-2 border-t border-white/5">
                <span className="text-sm bg-purple-500/20 text-purple-300 p-1.5 rounded-lg">🤖</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-400">VoiceFlow Response</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                      {item.intent}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{item.ai_response}</p>
                </div>
              </div>

              {item.detected_action && item.detected_action !== "None" && (
                <div className="mt-2 text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  ⚡ Actions Triggered: <span className="font-semibold text-white">{item.detected_action}</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
