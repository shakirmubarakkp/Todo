"use client";

import React, { useState, useEffect } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import {
  Search,
  CheckSquare,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Settings,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import { NavView, Task } from "@/types/todo";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onEditTask: (task: Task) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenNewTask,
  onOpenNewProject,
  onEditTask,
}: CommandPaletteProps) {
  const { tasks, setActiveView } = useTodo();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Handled in parent
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)).slice(0, 5)
    : [];

  const navActions: { label: string; view: NavView; icon: React.ElementType }[] = [
    { label: "Go to Dashboard", view: "dashboard", icon: LayoutDashboard },
    { label: "Go to My Tasks", view: "my-tasks", icon: CheckSquare },
    { label: "Go to Today's Tasks", view: "today", icon: Calendar },
    { label: "Go to Upcoming Tasks", view: "upcoming", icon: CalendarDays },
    { label: "Go to Completed Logbook", view: "completed", icon: CheckCircle2 },
    { label: "Go to Projects", view: "projects", icon: FolderKanban },
    { label: "Go to Settings", view: "settings", icon: Settings },
  ];

  const filteredNav = q
    ? navActions.filter((n) => n.label.toLowerCase().includes(q))
    : navActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs animate-in-fast">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <div className="relative border-b border-slate-100 dark:border-slate-800 flex items-center px-4">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks... (Esc to close)"
            className="w-full px-3 py-3.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          <div>
            <p className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenNewTask();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Create New Task</span>
                </div>
                <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                  N
                </kbd>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenNewProject();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Create New Project</span>
                </div>
              </button>
            </div>
          </div>

          {/* Matching Tasks if query exists */}
          {matchingTasks.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Tasks
              </p>
              <div className="space-y-0.5">
                {matchingTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onClose();
                      onEditTask(task);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <div className="truncate flex-1">
                      <span className="font-medium text-slate-900 dark:text-white block truncate">
                        {task.title}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Views */}
          {filteredNav.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Navigation
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setActiveView(item.view);
                        onClose();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
