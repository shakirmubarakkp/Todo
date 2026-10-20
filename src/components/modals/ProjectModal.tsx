"use client";

import React, { useState, useEffect } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Project } from "@/types/todo";
import { X, Check, Folder, Briefcase, User, Activity, BookOpen, Star, Rocket, ShoppingCart, Target } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const COLOR_PALETTE = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#64748b", // Slate
];

const ICONS = [
  { name: "Folder", icon: Folder },
  { name: "Briefcase", icon: Briefcase },
  { name: "User", icon: User },
  { name: "Activity", icon: Activity },
  { name: "BookOpen", icon: BookOpen },
  { name: "Star", icon: Star },
  { name: "Rocket", icon: Rocket },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Target", icon: Target },
];

interface ProjectModalDialogProps {
  onClose: () => void;
  projectToEdit?: Project | null;
}

function ProjectModalDialog({ onClose, projectToEdit }: ProjectModalDialogProps) {
  const { createProject, updateProject } = useTodo();

  const [name, setName] = useState(projectToEdit?.name || "");
  const [color, setColor] = useState(projectToEdit?.color || "#3b82f6");
  const [icon, setIcon] = useState(projectToEdit?.icon || "Folder");
  const [description, setDescription] = useState(projectToEdit?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (projectToEdit) {
        await updateProject(projectToEdit.id, {
          name: name.trim(),
          color,
          icon,
          description: description.trim() || undefined,
        });
      } else {
        await createProject({
          name: name.trim(),
          color,
          icon,
          description: description.trim() || undefined,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in-fast">
      <div
        className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 id="project-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
            {projectToEdit ? "Edit Project" : "New Project"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Campaign, Fitness Goals"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="project-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description (Optional)
            </label>
            <input
              id="project-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this project covers..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Color Theme
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    color === c ? "scale-110 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Project Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                    title={item.name}
                    aria-label={item.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              id="btn-save-project"
            >
              <Check className="w-4 h-4" />
              <span>{projectToEdit ? "Update Project" : "Create Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <ProjectModalDialog
      key={projectToEdit ? projectToEdit.id : "new-project-form"}
      onClose={onClose}
      projectToEdit={projectToEdit}
    />
  );
}
