"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import StatsOverview from "@/components/StatsOverview";
import VoiceStudio from "@/components/VoiceStudio";
import TaskList from "@/components/TaskList";
import MeetingCards from "@/components/MeetingCards";
import ChatHistory from "@/components/ChatHistory";

export default function Home() {
  const [activeTab, setActiveTab] = useState("studio");

  return (
    <div className="min-h-screen pb-16">
      
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Real-time stats header widget */}
        <StatsOverview />

        {/* Dynamic Tab Rendering */}
        {activeTab === "studio" && (
          <VoiceStudio onActionTriggered={() => {}} />
        )}

        {activeTab === "tasks" && (
          <TaskList />
        )}

        {activeTab === "meetings" && (
          <MeetingCards />
        )}

        {activeTab === "history" && (
          <ChatHistory />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-gray-500 py-6 border-t border-white/5">
        <p>Built by Deneshwaran M</p>
      </footer>

    </div>
  );
}
