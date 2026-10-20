"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TaskItem } from "../tasks/TaskItem";
import { Task } from "@/types/todo";
import { CheckCircle2, Trash2, Award } from "lucide-react";

interface CompletedViewProps {
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onClearAllCompleted: () => void;
}

export function CompletedView({
  onEditTask,
  onDeleteTask,
  onClearAllCompleted,
}: CompletedViewProps) {
  const { tasks } = useTodo();

  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-4 animate-in-fast">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Completed Logbook
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {completedTasks.length} total tasks completed and archived
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            onClick={onClearAllCompleted}
            className="self-start sm:self-auto h-9 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No completed tasks yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Check off items from your task list to build your accomplishment streak!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              canReorder={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
