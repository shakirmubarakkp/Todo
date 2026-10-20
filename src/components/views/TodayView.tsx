"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TaskList } from "../tasks/TaskList";
import { Task } from "@/types/todo";
import { Calendar, AlertTriangle } from "lucide-react";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

interface TodayViewProps {
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function TodayView({
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
}: TodayViewProps) {
  const { stats } = useTodo();
  const isMounted = useIsMounted();

  const formattedDate = isMounted
    ? new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-4 animate-in-fast">
      {/* Overdue Warning Banner */}
      {stats.overdue > 0 && (
        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-semibold text-rose-900 dark:text-rose-200 text-sm">
              You have {stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}
            </h4>
            <p className="mt-0.5 text-rose-700/80 dark:text-rose-300/80">
              Tasks listed below are either due today or were scheduled for a past date and remain uncompleted.
            </p>
          </div>
        </div>
      )}

      {/* Today Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Today&apos;s Focus
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {formattedDate ? `${formattedDate} • ` : ""}{stats.today} due today
          </p>
        </div>
      </div>

      <TaskList
        onOpenNewTask={onOpenNewTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        hideFilters={false}
      />
    </div>
  );
}
