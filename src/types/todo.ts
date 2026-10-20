export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'completed';

export type RecurringInterval = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly';

export interface Project {
  id: string;
  user_id?: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null; // ISO string YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD
  reminder?: boolean;
  project_id?: string | null;
  tags: string[];
  recurring: RecurringInterval;
  sort_order: number;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  date_format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  week_start: 'sunday' | 'monday';
  theme: 'system' | 'light' | 'dark';
  sound_effects: boolean;
}

export interface TaskFilter {
  search: string;
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | TaskPriority;
  project_id: string | 'all';
  tag: string | 'all';
  dueDate: 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date';
}

export interface TaskSort {
  field: 'due_date' | 'priority' | 'created_at' | 'title' | 'sort_order';
  direction: 'asc' | 'desc';
}

export type NavView =
  | 'dashboard'
  | 'my-tasks'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'projects'
  | 'settings';
