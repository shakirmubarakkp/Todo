import { Project, RecurringInterval, Task, UserProfile } from "@/types/todo";
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PROFILE } from "./mockData";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase/client";

const TASKS_KEY = "smart_todo_tasks";
const PROJECTS_KEY = "smart_todo_projects";
const PROFILE_KEY = "smart_todo_profile";
const DEMO_MODE_KEY = "smart_todo_is_demo";

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function calculateNextDueDate(currentDueDateStr: string | null | undefined, interval: RecurringInterval): string | null {
  if (interval === "none" || !currentDueDateStr) return null;
  const date = new Date(currentDueDateStr);
  if (isNaN(date.getTime())) return null;

  switch (interval) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekdays": {
      const day = date.getDay();
      if (day === 5) {
        // Friday -> Monday (+3)
        date.setDate(date.getDate() + 3);
      } else if (day === 6) {
        // Saturday -> Monday (+2)
        date.setDate(date.getDate() + 2);
      } else {
        date.setDate(date.getDate() + 1);
      }
      break;
    }
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date.toISOString();
}

export class TaskStorageService {
  // Local storage methods
  static getLocalTasks(): Task[] {
    if (!isBrowser()) return INITIAL_TASKS;
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  }

  static saveLocalTasks(tasks: Task[]): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }

  static getLocalProjects(): Project[] {
    if (!isBrowser()) return INITIAL_PROJECTS;
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      if (!data) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  static saveLocalProjects(projects: Project[]): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  }

  static getLocalProfile(): UserProfile {
    if (!isBrowser()) return INITIAL_PROFILE;
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
        return INITIAL_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROFILE;
    }
  }

  static saveLocalProfile(profile: UserProfile): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile to localStorage", e);
    }
  }

  static resetToDemoData(): void {
    if (!isBrowser()) return;
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(DEMO_MODE_KEY, "true");
  }

  static isDemoMode(): boolean {
    if (!isBrowser()) return true;
    if (!isSupabaseConfigured()) return true;
    const demo = localStorage.getItem(DEMO_MODE_KEY);
    return demo === "true" || demo === null;
  }

  static setDemoMode(isDemo: boolean): void {
    if (!isBrowser()) return;
    localStorage.setItem(DEMO_MODE_KEY, isDemo ? "true" : "false");
  }

  // Supabase sync methods
  static async fetchTasksFromSupabase(userId: string): Promise<Task[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.getLocalTasks();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks from Supabase:", error);
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status as Task["status"],
      priority: row.priority as Task["priority"],
      due_date: row.due_date,
      reminder: row.reminder,
      project_id: row.project_id,
      tags: row.tags || [],
      recurring: (row.recurring || "none") as RecurringInterval,
      sort_order: row.sort_order ?? 0,
      completed_at: row.completed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  static async fetchProjectsFromSupabase(userId: string): Promise<Project[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.getLocalProjects();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching projects from Supabase:", error);
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      color: row.color,
      icon: row.icon,
      description: row.description,
      created_at: row.created_at,
    }));
  }

  static async fetchProfileFromSupabase(userId: string, email: string): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.getLocalProfile();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile from Supabase:", error);
    }

    if (data) {
      return {
        id: data.id,
        email: email || data.email,
        display_name: data.display_name || email.split("@")[0] || "User",
        avatar_url: data.avatar_url,
        date_format: data.date_format || "YYYY-MM-DD",
        week_start: data.week_start || "monday",
        theme: data.theme || "system",
        sound_effects: data.sound_effects ?? true,
      };
    }

    // Default profile
    return {
      id: userId,
      email,
      display_name: email.split("@")[0] || "User",
      avatar_url: null,
      date_format: "YYYY-MM-DD",
      week_start: "monday",
      theme: "system",
      sound_effects: true,
    };
  }

  static async upsertTaskToSupabase(task: Task, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const payload = {
      id: task.id,
      user_id: userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      reminder: task.reminder,
      project_id: task.project_id || null,
      tags: task.tags,
      recurring: task.recurring,
      sort_order: task.sort_order,
      completed_at: task.completed_at,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("tasks").upsert(payload);
    if (error) {
      console.error("Error upserting task to Supabase:", error);
      throw error;
    }
  }

  static async deleteTaskFromSupabase(taskId: string, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting task from Supabase:", error);
      throw error;
    }
  }

  static async upsertProjectToSupabase(project: Project, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const payload = {
      id: project.id,
      user_id: userId,
      name: project.name,
      color: project.color,
      icon: project.icon,
      description: project.description,
    };

    const { error } = await supabase.from("projects").upsert(payload);
    if (error) {
      console.error("Error upserting project to Supabase:", error);
      throw error;
    }
  }

  static async deleteProjectFromSupabase(projectId: string, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting project from Supabase:", error);
      throw error;
    }
  }

  static async updateProfileInSupabase(profile: UserProfile, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const payload = {
      id: userId,
      display_name: profile.display_name,
      date_format: profile.date_format,
      week_start: profile.week_start,
      theme: profile.theme,
      sound_effects: profile.sound_effects,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) {
      console.error("Error updating profile in Supabase:", error);
      throw error;
    }
  }
}
