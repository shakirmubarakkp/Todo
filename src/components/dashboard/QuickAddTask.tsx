"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TaskPriority } from "@/types/todo";
import { Plus, Calendar, Flag, Folder, CornerDownLeft } from "lucide-react";

export function QuickAddTask() {
  const { createTask, projects } = useTodo();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [projectId, setProjectId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        priority,
        project_id: projectId || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTitle("");
      setDueDate("");
      setPriority("medium");
      setProjectId("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
            <Plus className="w-3 h-3 text-slate-400" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task... (e.g., 'Review Q3 goals' and press Enter)"
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            id="quick-add-task-input"
          />
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            id="quick-add-task-submit"
          >
            <span>Add</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Attribute Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {/* Priority selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="bg-transparent focus:outline-none cursor-pointer"
              aria-label="Task priority"
            >
              <option value="low" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Low Priority</option>
              <option value="medium" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Medium Priority</option>
              <option value="high" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">High Priority</option>
              <option value="urgent" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Urgent Priority</option>
            </select>
          </div>

          {/* Project selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <Folder className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer max-w-[120px] truncate"
              aria-label="Task project"
            >
              <option value="" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">No Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due date picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
              aria-label="Due date"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
