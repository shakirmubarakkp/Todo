"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { StatCards } from "../dashboard/StatCards";
import { CompletionGauge } from "../dashboard/CompletionGauge";
import { QuickAddTask } from "../dashboard/QuickAddTask";
import { ProductivityChart } from "../dashboard/ProductivityChart";
import { UpcomingDeadlines } from "../dashboard/UpcomingDeadlines";
import { Task } from "@/types/todo";
import { Sparkles, AlertCircle, Plus, CheckCircle2 } from "lucide-react";
import { PriorityBadge } from "../ui/Badge";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

interface DashboardViewProps {
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function DashboardView({
  onOpenNewTask,
  onEditTask,
}: DashboardViewProps) {
  const { profile, stats, tasks, toggleTaskComplete } = useTodo();
  const isMounted = useIsMounted();

  const urgentPendingTasks = tasks.filter(
    (t) => t.status === "pending" && (t.priority === "urgent" || t.priority === "high")
  ).slice(0, 3);

  const formattedCurrentDate = isMounted
    ? new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-6 animate-in-fast">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hello, {profile.display_name || "there"} 👋
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Today is <strong className="font-semibold text-slate-700 dark:text-slate-300">{formattedCurrentDate}</strong>.
            {stats.overdue > 0
              ? ` You have ${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""} needing attention.`
              : stats.today > 0
              ? ` You have ${stats.today} task${stats.today > 1 ? "s" : ""} scheduled for today.`
              : " You are right on track with all your tasks!"}
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="self-start sm:self-auto h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          id="btn-dashboard-new-task"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 1. Stat Cards Row */}
      <StatCards />

      {/* 2. Quick Add Task Input */}
      <QuickAddTask />

      {/* 3. Mid Section: Completion Gauge & Productivity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CompletionGauge />
        <ProductivityChart />
      </div>

      {/* 4. Bottom Section: Upcoming Deadlines & Urgent Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Deadlines */}
        <UpcomingDeadlines onEditTask={onEditTask} />

        {/* High Priority & Urgent Tasks Alert Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  High Priority Focus
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {urgentPendingTasks.length} Urgent / High
              </span>
            </div>

            {urgentPendingTasks.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No urgent tasks pending</p>
                <p className="text-xs text-slate-400 mt-1">Great job! All critical priority items are handled.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {urgentPendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onEditTask(task)}>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={task.priority} showIcon={false} />
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-colors cursor-pointer"
                        title="Mark Complete"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Tip: Press <strong>N</strong> anywhere to create a task</span>
            <span className="flex items-center gap-1 text-blue-500">
              <Sparkles className="w-3 h-3" /> Focus Mode Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
