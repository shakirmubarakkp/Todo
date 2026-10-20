"use client";

import React, { useMemo } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { TaskItem } from "./TaskItem";
import { Task } from "@/types/todo";
import {
  Search,
  ArrowUpDown,
  X,
  Plus,
  Inbox,
  Filter,
} from "lucide-react";

interface TaskListProps {
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  title?: string;
  description?: string;
  hideFilters?: boolean;
}

export function TaskList({
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  title,
  description,
  hideFilters = false,
}: TaskListProps) {
  const {
    filteredTasks,
    filter,
    setFilter,
    resetFilter,
    sort,
    setSort,
    projects,
    tasks,
  } = useTodo();

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [tasks]);

  const hasActiveFilters =
    filter.search !== "" ||
    filter.status !== "all" ||
    filter.priority !== "all" ||
    filter.project_id !== "all" ||
    filter.tag !== "all" ||
    filter.dueDate !== "all";

  return (
    <div className="space-y-4">
      {/* Header if provided */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onOpenNewTask}
            className="self-start sm:self-auto h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            id="btn-add-task-header"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      {!hideFilters && (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                placeholder="Search tasks by title, description, or tags..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                id="task-search-input"
              />
              {filter.search && (
                <button
                  onClick={() => setFilter({ search: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={`${sort.field}-${sort.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split("-");
                    setSort({
                      field: field as typeof sort.field,
                      direction: direction as typeof sort.direction,
                    });
                  }}
                  className="bg-transparent focus:outline-none cursor-pointer"
                  aria-label="Sort tasks by"
                >
                  <option value="sort_order-asc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Custom Order</option>
                  <option value="due_date-asc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Due Date (Earliest)</option>
                  <option value="due_date-desc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Due Date (Latest)</option>
                  <option value="priority-desc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Priority (Urgent first)</option>
                  <option value="priority-asc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Priority (Low first)</option>
                  <option value="created_at-desc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Created Date (Newest)</option>
                  <option value="title-asc" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Title (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Pills row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>

            {/* Status Filter */}
            <select
              value={filter.status}
              onChange={(e) => setFilter({ status: e.target.value as typeof filter.status })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="all" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Status: All</option>
              <option value="pending" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pending</option>
              <option value="completed" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ priority: e.target.value as typeof filter.priority })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              aria-label="Filter by priority"
            >
              <option value="all" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Priority: All</option>
              <option value="urgent" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Urgent</option>
              <option value="high" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">High</option>
              <option value="medium" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Medium</option>
              <option value="low" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Low</option>
            </select>

            {/* Project Filter */}
            <select
              value={filter.project_id}
              onChange={(e) => setFilter({ project_id: e.target.value })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              aria-label="Filter by project"
            >
              <option value="all" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Project: All</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>

            {/* Due Date Filter */}
            <select
              value={filter.dueDate}
              onChange={(e) => setFilter({ dueDate: e.target.value as typeof filter.dueDate })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              aria-label="Filter by due date"
            >
              <option value="all" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Due: All</option>
              <option value="today" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Due Today</option>
              <option value="upcoming" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Upcoming</option>
              <option value="overdue" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Overdue</option>
              <option value="no-date" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">No Due Date</option>
            </select>

            {/* Tag Filter (if tags exist) */}
            {allTags.length > 0 && (
              <select
                value={filter.tag}
                onChange={(e) => setFilter({ tag: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                aria-label="Filter by tag"
              >
                <option value="all" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Tag: All</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    #{tag}
                  </option>
                ))}
              </select>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilter}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors font-medium cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#111827]/40">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {hasActiveFilters ? "No matching tasks found" : "No tasks here yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? "Try adjusting your search query or removing active filters to see more results."
              : "Capture your ideas, deadlines, and deliverables. Create a task now!"}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <button
                onClick={resetFilter}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={onOpenNewTask}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              canReorder={sort.field === "sort_order"}
            />
          ))}
        </div>
      )}

      {filteredTasks.length > 0 && (
        <div className="text-right text-xs text-slate-400 pt-1">
          Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
        </div>
      )}
    </div>
  );
}
