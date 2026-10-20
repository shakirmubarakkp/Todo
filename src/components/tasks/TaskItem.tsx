"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Task } from "@/types/todo";
import { PriorityBadge } from "../ui/Badge";
import { formatFriendlyDate } from "@/lib/utils";
import {
  Check,
  Calendar,
  Repeat,
  Tag as TagIcon,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Bell,
} from "lucide-react";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  canReorder?: boolean;
}

export function TaskItem({ task, onEdit, onDelete, canReorder = true }: TaskItemProps) {
  const { toggleTaskComplete, projects, profile, moveTask } = useTodo();

  const isCompleted = task.status === "completed";
  const project = projects.find((p) => p.id === task.project_id);
  const friendlyDate = formatFriendlyDate(task.due_date, profile.date_format);

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
        isCompleted
          ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-75"
          : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm"
      }`}
    >
      {/* Complete Checkbox */}
      <button
        onClick={() => toggleTaskComplete(task.id)}
        className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer ${
          isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-transparent"
        }`}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
        aria-label={`Toggle completion for ${task.title}`}
      >
        <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? "text-white" : "group-hover:text-slate-300"}`} />
      </button>

      {/* Main Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              onClick={() => onEdit(task)}
              className={`text-sm font-semibold tracking-tight cursor-pointer truncate transition-colors ${
                isCompleted
                  ? "line-through text-slate-400 dark:text-slate-500"
                  : "text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Priority Badge */}
          <div className="shrink-0 flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Task Metadata Footer */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          {/* Project */}
          {project && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate max-w-[120px]">{project.name}</span>
            </span>
          )}

          {/* Due date */}
          {task.due_date && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                friendlyDate.isOverdue && !isCompleted
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                  : friendlyDate.isToday && !isCompleted
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{friendlyDate.label}</span>
            </span>
          )}

          {/* Reminder */}
          {task.reminder && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
              title="Reminder enabled"
            >
              <Bell className="w-3 h-3" />
            </span>
          )}

          {/* Recurring */}
          {task.recurring !== "none" && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium capitalize"
              title={`Recurring ${task.recurring}`}
            >
              <Repeat className="w-3 h-3" />
              <span>{task.recurring}</span>
            </span>
          )}

          {/* Tags */}
          {task.tags && task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <TagIcon className="w-2.5 h-2.5 opacity-60" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons (Visible on hover or mobile) */}
      <div className="shrink-0 flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {canReorder && (
          <div className="flex flex-col mr-1">
            <button
              onClick={() => moveTask(task.id, "up")}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Move Up"
              aria-label="Move task up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => moveTask(task.id, "down")}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Move Down"
              aria-label="Move task down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
          title="Edit Task"
          aria-label={`Edit ${task.title}`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title="Delete Task"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
