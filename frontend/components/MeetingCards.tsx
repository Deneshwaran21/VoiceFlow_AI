"use client";

import React, { useState, useEffect } from "react";
import { Meeting, fetchMeetings, deleteMeeting } from "@/lib/api";

export default function MeetingCards() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    setLoading(true);
    const data = await fetchMeetings();
    setMeetings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteMeeting(id);
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  return (
    <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📅</span> Smart Meetings Agenda
          </h2>
          <p className="text-xs text-gray-400">Scheduled events and syncs extracted from voice prompts</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
          {meetings.length} Scheduled
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading meetings agenda...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-400 space-y-2">
          <span className="text-3xl block">📆</span>
          <p className="text-sm">No upcoming meetings. Speak &quot;Schedule a meeting with team tomorrow at 10 AM&quot; to test!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="glass-card glass-card-hover rounded-xl p-5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base">{meeting.title}</h3>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    ❌
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center space-x-2 text-indigo-300 font-medium">
                    <span>🗓️</span>
                    <span>{meeting.date || "Scheduled Date"}</span>
                    {meeting.time && <span>• {meeting.time}</span>}
                  </div>
                  {meeting.participants && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>👥</span>
                      <span>With: {meeting.participants}</span>
                    </div>
                  )}
                  {meeting.location && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>📍</span>
                      <span>{meeting.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Confirmed
                </span>
                <span className="text-gray-500">ID #{meeting.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
