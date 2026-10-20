"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  CheckSquare,
  Plus,
  Moon,
  Sun,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { NavView } from "@/types/todo";

interface MobileHeaderProps {
  onOpenNewTask: () => void;
  onOpenAuth: () => void;
}

export function MobileHeader({ onOpenNewTask, onOpenAuth }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeView, setActiveView, stats, projects, user, signOut } = useTodo();
  const { theme, setTheme } = useTheme();

  const handleNav = (view: NavView, projId: string | null = null) => {
    setActiveView(view, projId);
    setIsOpen(false);
  };

  return (
    <header className="md:hidden bg-white dark:bg-[#0c1220] border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">FlowTask</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        <button
          onClick={onOpenNewTask}
          className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-slate-950/50 backdrop-blur-xs flex flex-col justify-between p-4 bg-white dark:bg-[#0c1220] overflow-y-auto animate-in-fast">
          <div className="space-y-4">
            <div className="space-y-1">
              <button
                onClick={() => handleNav("dashboard")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "dashboard" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => handleNav("my-tasks")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "my-tasks" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4" />
                  <span>My Tasks</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  {stats.pending}
                </span>
              </button>

              <button
                onClick={() => handleNav("today")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "today" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>Today</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                  {stats.today + stats.overdue}
                </span>
              </button>

              <button
                onClick={() => handleNav("upcoming")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "upcoming" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-4 h-4" />
                  <span>Upcoming</span>
                </div>
              </button>

              <button
                onClick={() => handleNav("completed")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "completed" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                  {stats.completed}
                </span>
              </button>

              <button
                onClick={() => handleNav("projects")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  activeView === "projects" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4" />
                  <span>Projects</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500">
                  {projects.length}
                </span>
              </button>
            </div>

            {/* Projects in Drawer */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Projects
              </p>
              <div className="space-y-1">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => handleNav("my-tasks", proj.id)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => handleNav("settings")}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Supabase</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
