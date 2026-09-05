"use client";

import React, { useState, useEffect } from "react";
import { Task, fetchTasks, toggleTaskCompleted, deleteTask } from "@/lib/api";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "high" | "pending" | "completed">("all");
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggle = async (task: Task) => {
    const updated = await toggleTaskCompleted(task.id, !task.completed);
    setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "high") return t.priority === "high" && !t.completed;
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📋</span> Action Tasks Dashboard
          </h2>
          <p className="text-xs text-gray-400">Tasks automatically extracted from your voice prompts</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "all" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "high" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            🔥 High Priority
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "pending" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "completed" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task Item Cards */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400 space-y-2">
          <span className="text-3xl block">🎯</span>
          <p className="text-sm">No tasks found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? "bg-white/2 border-white/5 opacity-60"
                  : "glass-card glass-card-hover border-white/10"
              }`}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        task.completed ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : task.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {task.priority === "high" ? "🔥 High" : task.priority === "medium" ? "🟡 Med" : "🟢 Low"}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{task.description}</p>
                  )}
                  {task.deadline && (
                    <p className="text-[11px] text-indigo-300 mt-1 flex items-center gap-1">
                      <span>📅</span> Deadline: {task.deadline}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="text-xs text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
