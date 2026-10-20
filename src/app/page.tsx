"use client";

import React, { useState, useEffect } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileHeader } from "@/components/navigation/MobileHeader";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { DashboardView } from "@/components/views/DashboardView";
import { MyTasksView } from "@/components/views/MyTasksView";
import { TodayView } from "@/components/views/TodayView";
import { UpcomingView } from "@/components/views/UpcomingView";
import { CompletedView } from "@/components/views/CompletedView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { SettingsView } from "@/components/views/SettingsView";
import { TaskModal } from "@/components/modals/TaskModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { Project, Task } from "@/types/todo";
import { Search } from "lucide-react";

export default function HomePage() {
  const {
    activeView,
    deleteTask,
    deleteProject,
    tasks,
    isLoading,
  } = useTodo();

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "task" | "project" | "completed-all";
    id: string;
    name: string;
  } | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K and N)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // N for New Task (only if not typing in input)
      if (e.key.toLowerCase() === "n" && !isInputActive && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setTaskToEdit(null);
        setIsTaskModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Handlers for Tasks
  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTaskPrompt = (task: Task) => {
    setItemToDelete({
      type: "task",
      id: task.id,
      name: task.title,
    });
    setIsDeleteModalOpen(true);
  };

  // Handlers for Projects
  const handleOpenNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProjectPrompt = (project: Project) => {
    setItemToDelete({
      type: "project",
      id: project.id,
      name: project.name,
    });
    setIsDeleteModalOpen(true);
  };

  // Clear all completed prompt
  const handleClearCompletedPrompt = () => {
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    setItemToDelete({
      type: "completed-all",
      id: "all-completed",
      name: `${completedCount} completed tasks`,
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "task") {
      await deleteTask(itemToDelete.id);
    } else if (itemToDelete.type === "project") {
      await deleteProject(itemToDelete.id);
    } else if (itemToDelete.type === "completed-all") {
      const completed = tasks.filter((t) => t.status === "completed");
      for (const t of completed) {
        await deleteTask(t.id);
      }
    }

    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* 1. Supabase / Demo Status Banner */}
      <DemoBanner onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* 2. Responsive Mobile Header */}
      <MobileHeader
        onOpenNewTask={handleOpenNewTask}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Main Body: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:flex">
          <Sidebar
            onOpenNewTask={handleOpenNewTask}
            onOpenNewProject={handleOpenNewProject}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        </div>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Quick Search Bar Trigger */}
          <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-[#0c1220]/60 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer w-full max-w-xs shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="flex-1 text-left truncate">Search or jump to...</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300">N</kbd> for quick task</span>
            </div>
          </div>

          {/* View Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              </div>
            ) : (
              <>
                {activeView === "dashboard" && (
                  <DashboardView
                    onOpenNewTask={handleOpenNewTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTaskPrompt}
                  />
                )}

                {activeView === "my-tasks" && (
                  <MyTasksView
                    onOpenNewTask={handleOpenNewTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTaskPrompt}
                  />
                )}

                {activeView === "today" && (
                  <TodayView
                    onOpenNewTask={handleOpenNewTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTaskPrompt}
                  />
                )}

                {activeView === "upcoming" && (
                  <UpcomingView
                    onOpenNewTask={handleOpenNewTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTaskPrompt}
                  />
                )}

                {activeView === "completed" && (
                  <CompletedView
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTaskPrompt}
                    onClearAllCompleted={handleClearCompletedPrompt}
                  />
                )}

                {activeView === "projects" && (
                  <ProjectsView
                    onOpenNewProject={handleOpenNewProject}
                    onEditProject={handleEditProject}
                    onDeleteProject={handleDeleteProjectPrompt}
                  />
                )}

                {activeView === "settings" && (
                  <SettingsView onOpenAuth={() => setIsAuthModalOpen(true)} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={
          itemToDelete?.type === "project"
            ? `Delete Project "${itemToDelete?.name}"?`
            : itemToDelete?.type === "completed-all"
            ? "Clear All Completed Tasks?"
            : `Delete Task "${itemToDelete?.name}"?`
        }
        message={
          itemToDelete?.type === "project"
            ? "Are you sure you want to delete this project? Associated tasks will not be deleted, but will become unassigned."
            : itemToDelete?.type === "completed-all"
            ? "Are you sure you want to permanently delete all completed tasks from your logbook? This action cannot be undone."
            : "Are you sure you want to delete this task? This action cannot be undone."
        }
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenNewTask={handleOpenNewTask}
        onOpenNewProject={handleOpenNewProject}
        onEditTask={handleEditTask}
      />
    </div>
  );
}
