"use client";

import React, { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    async function verify() {
      const healthy = await checkBackendHealth();
      setIsBackendHealthy(healthy);
    }
    verify();
    const interval = setInterval(verify, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg glow-purple">
            <span className="text-xl">🎙️</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-400">
                VoiceFlow AI
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Action Intelligence
              </span>
            </div>
            <p className="text-xs text-gray-400">Speak naturally. AI understands, organizes, and acts.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "studio"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            🎙️ Voice Studio
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "tasks"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            📋 Tasks
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "meetings"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            📅 Meetings
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            💬 History
          </button>
        </nav>

        {/* System Health Status */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Backend API:</span>
          {isBackendHealthy === null ? (
            <span className="flex items-center space-x-1.5 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
              <span>Connecting...</span>
            </span>
          ) : isBackendHealthy ? (
            <span className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold">FastAPI Live</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>Offline</span>
            </span>
          )}
        </div>

      </div>
    </header>
  );
}
