"use client";

import React from "react";
import { TaskList } from "../tasks/TaskList";
import { Task } from "@/types/todo";
import { CalendarDays } from "lucide-react";

interface UpcomingViewProps {
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function UpcomingView({
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
}: UpcomingViewProps) {
  return (
    <div className="space-y-4 animate-in-fast">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Upcoming Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tasks scheduled for tomorrow and beyond
          </p>
        </div>
      </div>

      <TaskList
        onOpenNewTask={onOpenNewTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
