"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Settings,
  Plus,
  Moon,
  Sun,
  Laptop,
  LogOut,
  LogIn,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { NavView } from "@/types/todo";

interface SidebarProps {
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onOpenAuth: () => void;
}

export function Sidebar({ onOpenNewTask, onOpenNewProject, onOpenAuth }: SidebarProps) {
  const {
    activeView,
    selectedProjectId,
    setActiveView,
    stats,
    projects,
    tasks,
    profile,
    user,
    signOut,
  } = useTodo();

  const { theme, setTheme } = useTheme();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const navItems: { view: NavView; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    {
      view: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      view: "my-tasks",
      label: "My Tasks",
      icon: CheckSquare,
      badge: stats.pending,
      badgeColor: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    },
    {
      view: "today",
      label: "Today",
      icon: Calendar,
      badge: stats.today + stats.overdue,
      badgeColor: stats.overdue > 0 ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold" : "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    },
    {
      view: "upcoming",
      label: "Upcoming",
      icon: CalendarDays,
    },
    {
      view: "completed",
      label: "Completed",
      icon: CheckCircle2,
      badge: stats.completed,
      badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      view: "projects",
      label: "Projects",
      icon: FolderKanban,
      badge: projects.length,
      badgeColor: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
    },
  ];

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-indigo-400" />;
    if (theme === "light") return <Sun className="w-4 h-4 text-amber-500" />;
    return <Laptop className="w-4 h-4 text-slate-400" />;
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#0c1220] border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-full select-none transition-colors duration-200">
      {/* Brand & App Title */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              FlowTask
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 pb-2">
        <button
          onClick={onOpenNewTask}
          className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-between shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-150 cursor-pointer group"
          id="btn-sidebar-new-task"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
            New Task
          </span>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-500/40 text-blue-100 border border-blue-400/30">
            N
          </kbd>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view && !selectedProjectId;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view, null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                id={`nav-${item.view}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Projects Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  projectsExpanded ? "" : "-rotate-90"
                }`}
              />
              <span>Projects</span>
            </button>
            <button
              onClick={onOpenNewProject}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Add New Project"
              id="btn-sidebar-add-project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {projectsExpanded && (
            <div className="mt-1 space-y-0.5 animate-in-fast">
              {projects.map((proj) => {
                const isSelected = activeView === "my-tasks" && selectedProjectId === proj.id;
                const taskCount = tasks.filter((t) => t.project_id === proj.id && t.status === "pending").length;

                return (
                  <button
                    key={proj.id}
                    onClick={() => setActiveView("my-tasks", proj.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    {taskCount > 0 && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                        {taskCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer / User & Settings Section */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
        {/* Settings button */}
        <button
          onClick={() => setActiveView("settings")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
            activeView === "settings"
              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
          id="nav-settings"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </div>
        </button>

        {/* User Profile Card & Theme Toggle */}
        <div className="pt-2 flex items-center justify-between gap-2 px-1">
          <div
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 min-w-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex-1"
            title={user ? `Signed in as ${user.email}` : "Click to sign in with Supabase"}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 shadow-xs">
              {profile.display_name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {profile.display_name || "Demo User"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                {user ? (
                  <span className="text-emerald-500 font-medium">Synced</span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Sparkles className="w-2.5 h-2.5" /> Demo
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Current theme: ${theme || "system"}. Click to toggle.`}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>

            {/* Auth / Logout Button */}
            {user ? (
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Sign In with Supabase"
                aria-label="Sign in"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
