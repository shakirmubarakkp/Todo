"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Project } from "@/types/todo";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  User,
  Activity,
  BookOpen,
  Folder,
  Star,
  Rocket,
  ShoppingCart,
  Target,
} from "lucide-react";

interface ProjectsViewProps {
  onOpenNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Folder,
  Briefcase,
  User,
  Activity,
  BookOpen,
  Star,
  Rocket,
  ShoppingCart,
  Target,
};

export function ProjectsView({
  onOpenNewProject,
  onEditProject,
  onDeleteProject,
}: ProjectsViewProps) {
  const { projects, tasks, setActiveView } = useTodo();

  return (
    <div className="space-y-6 animate-in-fast">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Projects & Categories
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize work, personal goals, and initiatives into dedicated workspaces
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="self-start sm:self-auto h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          id="btn-add-project-main"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <FolderKanban className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No projects created yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Group your tasks into projects like Work, Personal, Fitness, or Learning.
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const projectTasks = tasks.filter((t) => t.project_id === proj.id);
            const total = projectTasks.length;
            const completed = projectTasks.filter((t) => t.status === "completed").length;
            const pending = total - completed;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            const IconComponent = ICON_MAP[proj.icon] || Folder;

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: proj.color }}
                    >
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditProject(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Project"
                        aria-label={`Edit ${proj.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete Project"
                        aria-label={`Delete ${proj.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Task counts & View button */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {pending} pending
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {completed} done
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveView("my-tasks", proj.id)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
