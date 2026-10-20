"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { PriorityBadge } from "../ui/Badge";
import { formatFriendlyDate } from "@/lib/utils";
import { Calendar, Check, ChevronRight, Clock } from "lucide-react";
import { Task } from "@/types/todo";

interface UpcomingDeadlinesProps {
  onEditTask: (task: Task) => void;
}

export function UpcomingDeadlines({ onEditTask }: UpcomingDeadlinesProps) {
  const { tasks, projects, toggleTaskComplete, profile, setActiveView } = useTodo();

  // Find pending tasks with due dates in the next 7 days, sorted earliest first
  const deadlineTasks = tasks
    .filter((t) => t.status === "pending" && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-base">
            Upcoming Deadlines
          </h3>
        </div>
        <button
          onClick={() => setActiveView("upcoming")}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {deadlineTasks.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No upcoming deadlines</p>
          <p className="text-xs text-slate-400 mt-1">You are all caught up on scheduled tasks!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deadlineTasks.map((task) => {
            const project = projects.find((p) => p.id === task.project_id);
            const friendly = formatFriendlyDate(task.due_date, profile.date_format);

            return (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Complete checkbox */}
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    title="Mark complete"
                  >
                    <Check className="w-3 h-3 text-transparent group-hover:text-slate-400 transition-colors" />
                  </button>

                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onEditTask(task)}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {project && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <span>{project.name}</span>
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-medium ${
                          friendly.isOverdue
                            ? "text-rose-500 font-semibold"
                            : friendly.isToday
                            ? "text-blue-500 font-semibold"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {friendly.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <PriorityBadge priority={task.priority} showIcon={false} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
