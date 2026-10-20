"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { NavView, Project, Task, TaskFilter, TaskPriority, TaskSort, UserProfile } from "@/types/todo";
import { calculateNextDueDate, TaskStorageService } from "../storage/taskStorage";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase/client";
import { INITIAL_PROFILE } from "../storage/mockData";
import { playCompletionSound } from "../utils";
import { useIsMounted } from "../hooks/useIsMounted";

interface ToastNotification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  today: number;
  completionRate: number;
  weeklyProductivity: { day: string; date: string; completed: number; created: number }[];
}

interface TodoContextType {
  tasks: Task[];
  projects: Project[];
  profile: UserProfile;
  filter: TaskFilter;
  sort: TaskSort;
  activeView: NavView;
  selectedProjectId: string | null;
  isLoading: boolean;
  isDemoMode: boolean;
  isSupabaseReady: boolean;
  user: { id: string; email: string } | null;
  stats: TodoStats;
  filteredTasks: Task[];
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;

  // Task actions
  createTask: (data: Omit<Partial<Task>, "id" | "created_at"> & { title: string }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, direction: "up" | "down") => Promise<void>;
  reorderTasks: (reordered: Task[]) => Promise<void>;

  // Project actions
  createProject: (data: { name: string; color: string; icon: string; description?: string }) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Navigation & Filter actions
  setActiveView: (view: NavView, projectId?: string | null) => void;
  setFilter: (filterUpdates: Partial<TaskFilter>) => void;
  resetFilter: () => void;
  setSort: (sort: TaskSort) => void;

  // System & Auth
  resetToDemoData: () => void;
  switchDemoMode: (demo: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error: Error | null; message?: string }>;
  resetPassword: (email: string) => Promise<{ error: Error | null; message?: string }>;
  signOut: () => Promise<void>;
}

const defaultFilter: TaskFilter = {
  search: "",
  status: "all",
  priority: "all",
  project_id: "all",
  tag: "all",
  dueDate: "all",
};

const defaultSort: TaskSort = {
  field: "sort_order",
  direction: "asc",
};

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [filter, setFilterState] = useState<TaskFilter>(defaultFilter);
  const [sort, setSort] = useState<TaskSort>(defaultSort);
  const [activeView, setActiveViewInternal] = useState<NavView>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const isSupabaseReady = isSupabaseConfigured();

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const hasMounted = useIsMounted();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize and check auth
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setIsLoading(true);
      const isConfigured = isSupabaseConfigured();
      const supabase = getSupabaseClient();

      if (isConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser({ id: session.user.id, email: session.user.email || "" });
            setIsDemoMode(false);

            // Fetch from Supabase
            const [fetchedTasks, fetchedProjects, fetchedProfile] = await Promise.all([
              TaskStorageService.fetchTasksFromSupabase(session.user.id).catch(() => TaskStorageService.getLocalTasks()),
              TaskStorageService.fetchProjectsFromSupabase(session.user.id).catch(() => TaskStorageService.getLocalProjects()),
              TaskStorageService.fetchProfileFromSupabase(session.user.id, session.user.email || "").catch(() => TaskStorageService.getLocalProfile()),
            ]);

            if (isMounted) {
              setTasks(fetchedTasks);
              setProjects(fetchedProjects);
              setProfile(fetchedProfile);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Supabase auth check error, falling back to local mode:", e);
        }
      }

      // Default to Local / Demo mode
      if (isMounted) {
        setIsDemoMode(TaskStorageService.isDemoMode());
        setTasks(TaskStorageService.getLocalTasks());
        setProjects(TaskStorageService.getLocalProjects());
        setProfile(TaskStorageService.getLocalProfile());
        setIsLoading(false);
      }
    }

    initialize();

    // Listen to Supabase Auth state changes if configured
    if (isSupabaseReady) {
      const supabase = getSupabaseClient();
      const { data: authListener } = supabase?.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || "" });
          setIsDemoMode(false);
          try {
            const [fetchedTasks, fetchedProjects, fetchedProfile] = await Promise.all([
              TaskStorageService.fetchTasksFromSupabase(session.user.id),
              TaskStorageService.fetchProjectsFromSupabase(session.user.id),
              TaskStorageService.fetchProfileFromSupabase(session.user.id, session.user.email || ""),
            ]);
            setTasks(fetchedTasks);
            setProjects(fetchedProjects);
            setProfile(fetchedProfile);
          } catch (e) {
            console.error("Failed to load user data from Supabase", e);
          }
        } else {
          setUser(null);
          setIsDemoMode(true);
          setTasks(TaskStorageService.getLocalTasks());
          setProjects(TaskStorageService.getLocalProjects());
          setProfile(TaskStorageService.getLocalProfile());
        }
      }) || { data: { subscription: { unsubscribe: () => {} } } };

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [isSupabaseReady]);

  // Persist tasks locally whenever changed in demo mode
  const persistTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    if (isDemoMode || !user) {
      TaskStorageService.saveLocalTasks(newTasks);
    }
  }, [isDemoMode, user]);

  // Persist projects locally whenever changed in demo mode
  const persistProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    if (isDemoMode || !user) {
      TaskStorageService.saveLocalProjects(newProjects);
    }
  }, [isDemoMode, user]);

  // Task Actions
  const createTask = useCallback(async (data: Omit<Partial<Task>, "id" | "created_at"> & { title: string }): Promise<Task> => {
    const newTask: Task = {
      id: "task-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      user_id: user?.id,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: "pending",
      priority: data.priority || "medium",
      due_date: data.due_date || null,
      reminder: data.reminder ?? false,
      project_id: data.project_id || (selectedProjectId && selectedProjectId !== "all" ? selectedProjectId : null),
      tags: data.tags || [],
      recurring: data.recurring || "none",
      sort_order: tasks.length ? Math.min(...tasks.map(t => t.sort_order)) - 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    persistTasks(updatedTasks);
    showToast(`Task "${newTask.title.slice(0, 30)}${newTask.title.length > 30 ? "..." : ""}" created`, "success");

    if (!isDemoMode && user) {
      try {
        await TaskStorageService.upsertTaskToSupabase(newTask, user.id);
      } catch {
        showToast("Synced locally; failed to push to Supabase", "error");
      }
    }

    return newTask;
  }, [tasks, user, isDemoMode, persistTasks, showToast, selectedProjectId]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>): Promise<void> => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const updatedTask: Task = {
      ...targetTask,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
    persistTasks(updatedTasks);
    showToast("Task updated successfully", "success");

    if (!isDemoMode && user) {
      try {
        await TaskStorageService.upsertTaskToSupabase(updatedTask, user.id);
      } catch {
        showToast("Updated locally; Supabase sync failed", "error");
      }
    }
  }, [tasks, user, isDemoMode, persistTasks, showToast]);

  const toggleTaskComplete = useCallback(async (id: string): Promise<void> => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const nextStatus: Task["status"] = targetTask.status === "completed" ? "pending" : "completed";
    const completedAt = nextStatus === "completed" ? new Date().toISOString() : null;

    if (nextStatus === "completed") {
      playCompletionSound(profile.sound_effects);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      });
    }

    let updatedTasks: Task[] = tasks.map((t) =>
      t.id === id ? { ...t, status: nextStatus, completed_at: completedAt, updated_at: new Date().toISOString() } : t
    );

    // If recurring task completed, generate next recurring task
    if (nextStatus === "completed" && targetTask.recurring !== "none" && targetTask.due_date) {
      const nextDue = calculateNextDueDate(targetTask.due_date, targetTask.recurring);
      if (nextDue) {
        const nextOccurrence: Task = {
          ...targetTask,
          id: "task-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
          status: "pending",
          due_date: nextDue,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sort_order: Math.min(...tasks.map(t => t.sort_order)) - 1,
        };
        updatedTasks = [nextOccurrence, ...updatedTasks];
        showToast(`Next recurring task scheduled for ${new Date(nextDue).toLocaleDateString()}`, "info");

        if (!isDemoMode && user) {
          TaskStorageService.upsertTaskToSupabase(nextOccurrence, user.id).catch(console.error);
        }
      }
    }

    persistTasks(updatedTasks);
    showToast(nextStatus === "completed" ? "Task marked completed!" : "Task reopened", "success");

    if (!isDemoMode && user) {
      const updated = updatedTasks.find((t) => t.id === id);
      if (updated) {
        TaskStorageService.upsertTaskToSupabase(updated, user.id).catch(console.error);
      }
    }
  }, [tasks, user, isDemoMode, persistTasks, showToast, profile.sound_effects]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    persistTasks(updatedTasks);
    showToast("Task deleted", "info");

    if (!isDemoMode && user) {
      try {
        await TaskStorageService.deleteTaskFromSupabase(id, user.id);
      } catch {
        showToast("Deleted locally; Supabase deletion error", "error");
      }
    }
  }, [tasks, user, isDemoMode, persistTasks, showToast]);

  const moveTask = useCallback(async (taskId: string, direction: "up" | "down"): Promise<void> => {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === tasks.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...tasks];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update sort_order numbers
    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));

    persistTasks(updatedWithOrder);
  }, [tasks, persistTasks]);

  const reorderTasks = useCallback(async (reordered: Task[]): Promise<void> => {
    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));
    persistTasks(updatedWithOrder);
  }, [persistTasks]);

  // Project Actions
  const createProject = useCallback(async (data: { name: string; color: string; icon: string; description?: string }): Promise<Project> => {
    const newProject: Project = {
      id: "proj-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      user_id: user?.id,
      name: data.name.trim(),
      color: data.color,
      icon: data.icon,
      description: data.description?.trim(),
      created_at: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    persistProjects(updatedProjects);
    showToast(`Project "${newProject.name}" created`, "success");

    if (!isDemoMode && user) {
      try {
        await TaskStorageService.upsertProjectToSupabase(newProject, user.id);
      } catch {
        showToast("Project saved locally; Supabase sync error", "error");
      }
    }

    return newProject;
  }, [projects, user, isDemoMode, persistProjects, showToast]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<void> => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    const updated: Project = { ...target, ...updates };
    const updatedProjects = projects.map((p) => (p.id === id ? updated : p));
    persistProjects(updatedProjects);
    showToast("Project updated", "success");

    if (!isDemoMode && user) {
      TaskStorageService.upsertProjectToSupabase(updated, user.id).catch(console.error);
    }
  }, [projects, user, isDemoMode, persistProjects, showToast]);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    persistProjects(updatedProjects);

    // Unassign tasks belonging to this project
    const updatedTasks = tasks.map((t) => (t.project_id === id ? { ...t, project_id: null } : t));
    persistTasks(updatedTasks);
    showToast("Project deleted", "info");

    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      setActiveViewInternal("projects");
    }

    if (!isDemoMode && user) {
      TaskStorageService.deleteProjectFromSupabase(id, user.id).catch(console.error);
    }
  }, [projects, tasks, selectedProjectId, user, isDemoMode, persistProjects, persistTasks, showToast]);

  // Profile Actions
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<void> => {
    const updatedProfile: UserProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    TaskStorageService.saveLocalProfile(updatedProfile);
    showToast("Preferences saved", "success");

    if (!isDemoMode && user) {
      TaskStorageService.updateProfileInSupabase(updatedProfile, user.id).catch(console.error);
    }
  }, [profile, user, isDemoMode, showToast]);

  // Navigation
  const setActiveView = useCallback((view: NavView, projectId: string | null = null) => {
    setActiveViewInternal(view);
    setSelectedProjectId(projectId);
  }, []);

  const setFilter = useCallback((filterUpdates: Partial<TaskFilter>) => {
    setFilterState((prev) => ({ ...prev, ...filterUpdates }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState(defaultFilter);
  }, []);

  // Demo & Reset
  const resetToDemoData = useCallback(() => {
    TaskStorageService.resetToDemoData();
    setTasks(TaskStorageService.getLocalTasks());
    setProjects(TaskStorageService.getLocalProjects());
    setProfile(TaskStorageService.getLocalProfile());
    setIsDemoMode(true);
    showToast("Sample demo data restored", "info");
  }, [showToast]);

  const switchDemoMode = useCallback((demo: boolean) => {
    setIsDemoMode(demo);
    TaskStorageService.setDemoMode(demo);
    if (demo) {
      setTasks(TaskStorageService.getLocalTasks());
      setProjects(TaskStorageService.getLocalProjects());
      setProfile(TaskStorageService.getLocalProfile());
    }
  }, []);

  // Supabase Auth Methods
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: new Error("Supabase is not configured yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.") };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error };
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email || email });
      setIsDemoMode(false);
      showToast("Signed in successfully!", "success");
    }
    return { error: null };
  }, [showToast]);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: new Error("Supabase is not configured. Please add your credentials to .env.local.") };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    if (error) {
      return { error };
    }
    if (data.user) {
      showToast("Account created! Check your email to confirm registration or sign in.", "success");
    }
    return { error: null, message: "Account created successfully!" };
  }, [showToast]);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback?type=recovery` : undefined,
    });
    if (error) {
      return { error };
    }
    showToast("Password reset instructions sent to your email", "info");
    return { error: null, message: "Reset email sent" };
  }, [showToast]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoMode(true);
    setTasks(TaskStorageService.getLocalTasks());
    setProjects(TaskStorageService.getLocalProjects());
    showToast("Signed out", "info");
  }, [showToast]);

  // Statistics calculation
  const stats = useMemo<TodoStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (!hasMounted) {
      return {
        total,
        completed,
        pending,
        overdue: 0,
        today: 0,
        completionRate,
        weeklyProductivity: [
          { day: "Sun", date: "10/18", completed: 1, created: 2 },
          { day: "Mon", date: "10/19", completed: 2, created: 3 },
          { day: "Tue", date: "10/20", completed: 0, created: 1 },
          { day: "Wed", date: "10/21", completed: 0, created: 0 },
          { day: "Thu", date: "10/22", completed: 0, created: 0 },
          { day: "Fri", date: "10/23", completed: 0, created: 0 },
          { day: "Sat", date: "10/24", completed: 0, created: 0 },
        ],
      };
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    let overdue = 0;
    let today = 0;

    tasks.forEach((t) => {
      if (t.status === "pending" && t.due_date) {
        const dueDate = new Date(t.due_date);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < todayDate) {
          overdue++;
        } else if (dueDate.getTime() === todayDate.getTime()) {
          today++;
        }
      }
    });

    // 7-day productivity calculation
    const weeklyProductivity = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const completedOnDay = tasks.filter((t) => {
        if (!t.completed_at) return false;
        const compDate = new Date(t.completed_at);
        return compDate >= d && compDate < nextD;
      }).length;

      const createdOnDay = tasks.filter((t) => {
        const createDate = new Date(t.created_at);
        return createDate >= d && createDate < nextD;
      }).length;

      weeklyProductivity.push({
        day: dayNames[d.getDay()],
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        completed: completedOnDay,
        created: createdOnDay,
      });
    }

    return {
      total,
      completed,
      pending,
      overdue,
      today,
      completionRate,
      weeklyProductivity,
    };
  }, [tasks, hasMounted]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    if (!hasMounted) return tasks;
    return tasks
      .filter((task) => {
        // Active view specific filter
        if (activeView === "today") {
          if (task.status === "completed") return false;
          if (!task.due_date) return false;
          const d = new Date(task.due_date);
          d.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Include overdue + today
          return d <= today;
        }

        if (activeView === "upcoming") {
          if (task.status === "completed") return false;
          if (!task.due_date) return false;
          const d = new Date(task.due_date);
          d.setHours(0, 0, 0, 0);
          const tomorrow = new Date();
          tomorrow.setHours(0, 0, 0, 0);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return d >= tomorrow;
        }

        if (activeView === "completed") {
          return task.status === "completed";
        }

        if (selectedProjectId) {
          if (task.project_id !== selectedProjectId) return false;
        }

        // Search text
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) ?? false;
          const matchTags = task.tags.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTags) return false;
        }

        // Status
        if (filter.status !== "all" && task.status !== filter.status) {
          return false;
        }

        // Priority
        if (filter.priority !== "all" && task.priority !== filter.priority) {
          return false;
        }

        // Project filter
        if (filter.project_id !== "all" && task.project_id !== filter.project_id) {
          return false;
        }

        // Tag filter
        if (filter.tag !== "all" && !task.tags.includes(filter.tag)) {
          return false;
        }

        // Due date filter
        if (filter.dueDate !== "all") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (filter.dueDate === "no-date") {
            if (task.due_date) return false;
          } else if (!task.due_date) {
            return false;
          } else {
            const d = new Date(task.due_date);
            d.setHours(0, 0, 0, 0);

            if (filter.dueDate === "today" && d.getTime() !== today.getTime()) {
              return false;
            }
            if (filter.dueDate === "overdue" && d >= today) {
              return false;
            }
            if (filter.dueDate === "upcoming" && d < tomorrow) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dir = sort.direction === "asc" ? 1 : -1;

        if (sort.field === "due_date") {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) * dir;
        }

        if (sort.field === "priority") {
          const priorityWeights: Record<TaskPriority, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return (priorityWeights[b.priority] - priorityWeights[a.priority]) * dir;
        }

        if (sort.field === "title") {
          return a.title.localeCompare(b.title) * dir;
        }

        if (sort.field === "created_at") {
          return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * dir;
        }

        // Default: sort_order
        return (a.sort_order - b.sort_order) * dir;
      });
  }, [tasks, activeView, selectedProjectId, filter, sort, hasMounted]);

  return (
    <TodoContext.Provider
      value={{
        tasks,
        projects,
        profile,
        filter,
        sort,
        activeView,
        selectedProjectId,
        isLoading,
        isDemoMode,
        isSupabaseReady,
        user,
        stats,
        filteredTasks,
        toasts,
        removeToast,
        showToast,
        createTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        moveTask,
        reorderTasks,
        createProject,
        updateProject,
        deleteProject,
        updateProfile,
        setActiveView,
        setFilter,
        resetFilter,
        setSort,
        resetToDemoData,
        switchDemoMode,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
