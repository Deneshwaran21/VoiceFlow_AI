"use client";

import React, { useState, useEffect } from "react";
import { Stats, fetchStats } from "@/lib/api";

export default function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  const loadStats = async () => {
    const data = await fetchStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
      
      {/* Active Tasks Card */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-indigo-500 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase">Pending Tasks</p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.pending_tasks}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl">
          📋
        </div>
      </div>

      {/* High Priority Card */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-red-500 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase">High Priority</p>
          <p className="text-2xl font-extrabold text-red-400 mt-1">{stats.high_priority_tasks}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl">
          🔥
        </div>
      </div>

      {/* Meetings Card */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-purple-500 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase">Scheduled Meetings</p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.total_meetings}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
          📅
        </div>
      </div>

      {/* Total Interactions Card */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-emerald-500 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase">Voice Interactions</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.total_interactions}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
          🎙️
        </div>
      </div>

    </div>
  );
}
