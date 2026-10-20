"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TaskList } from "../tasks/TaskList";
import { Task } from "@/types/todo";
import { X } from "lucide-react";

interface MyTasksViewProps {
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function MyTasksView({
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
}: MyTasksViewProps) {
  const { selectedProjectId, projects, setActiveView } = useTodo();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-4 animate-in-fast">
      {/* Selected Project Header Banner if filtering by specific project */}
      {selectedProject && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: selectedProject.color }}
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedProject.name}</span>
                <span className="text-[10px] font-normal text-slate-400">Project View</span>
              </h3>
              {selectedProject.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedProject.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveView("my-tasks", null)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Show All Tasks</span>
          </button>
        </div>
      )}

      <TaskList
        title={selectedProject ? undefined : "All Tasks"}
        description={selectedProject ? undefined : "View, manage, and filter your complete task list across all categories."}
        onOpenNewTask={onOpenNewTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
