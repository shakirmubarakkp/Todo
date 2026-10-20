import { Project, Task, UserProfile } from "@/types/todo";

export function getInitialProjects(): Project[] {
  return [
    {
      id: "proj-work",
      name: "Work & Career",
      color: "#3b82f6", // Blue
      icon: "Briefcase",
      description: "Company roadmap, sprint deliverables, and team syncs",
      created_at: "2026-10-01T09:00:00.000Z",
    },
    {
      id: "proj-personal",
      name: "Personal Life",
      color: "#10b981", // Emerald
      icon: "User",
      description: "Errands, home improvement, and family reminders",
      created_at: "2026-10-05T09:00:00.000Z",
    },
    {
      id: "proj-fitness",
      name: "Health & Fitness",
      color: "#f59e0b", // Amber
      icon: "Activity",
      description: "Workouts, nutrition planning, and doctor checkups",
      created_at: "2026-10-08T09:00:00.000Z",
    },
    {
      id: "proj-learning",
      name: "Learning & Dev",
      color: "#8b5cf6", // Purple
      icon: "BookOpen",
      description: "Books, technical courses, and side projects",
      created_at: "2026-10-10T09:00:00.000Z",
    },
  ];
}

export function getInitialTasks(): Task[] {
  // Use stable baseline dates
  const nowMs = typeof window !== "undefined" ? Date.now() : 1792396800000;
  const todayStr = new Date(nowMs).toISOString();
  const yesterdayStr = new Date(nowMs - 24 * 60 * 60 * 1000).toISOString();
  const tomorrowStr = new Date(nowMs + 24 * 60 * 60 * 1000).toISOString();
  const threeDaysLater = new Date(nowMs + 3 * 24 * 60 * 60 * 1000).toISOString();
  const fiveDaysLater = new Date(nowMs + 5 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "task-1",
      title: "Complete client quarterly business review deck",
      description: "Finalize metrics, revenue expansion slides, and churn mitigation plan for Executive leadership.",
      status: "pending",
      priority: "urgent",
      due_date: todayStr,
      reminder: true,
      project_id: "proj-work",
      tags: ["Strategy", "Executive", "Urgent"],
      recurring: "none",
      sort_order: 1,
      created_at: yesterdayStr,
    },
    {
      id: "task-2",
      title: "Review pull request #248 (Payment Gateway integration)",
      description: "Check idempotency keys, Stripe webhooks handler, and unit test coverage.",
      status: "pending",
      priority: "high",
      due_date: todayStr,
      reminder: false,
      project_id: "proj-work",
      tags: ["Dev", "Code Review"],
      recurring: "none",
      sort_order: 2,
      created_at: yesterdayStr,
    },
    {
      id: "task-3",
      title: "Renew car insurance policy",
      description: "Compare quotes between Geico and State Farm before expiration.",
      status: "pending",
      priority: "medium",
      due_date: yesterdayStr,
      reminder: true,
      project_id: "proj-personal",
      tags: ["Finance", "Important"],
      recurring: "none",
      sort_order: 3,
      created_at: yesterdayStr,
    },
    {
      id: "task-4",
      title: "Schedule annual dental cleaning checkup",
      description: "Call Dr. Evans' clinic to book for Thursday afternoon.",
      status: "pending",
      priority: "low",
      due_date: tomorrowStr,
      reminder: false,
      project_id: "proj-fitness",
      tags: ["Health"],
      recurring: "none",
      sort_order: 4,
      created_at: yesterdayStr,
    },
    {
      id: "task-5",
      title: "45-minute HIIT workout session",
      description: "Warmup 10 min, 5 sets kettlebell swings, burpees, and core cool-down.",
      status: "pending",
      priority: "medium",
      due_date: todayStr,
      reminder: false,
      project_id: "proj-fitness",
      tags: ["Exercise", "Habit"],
      recurring: "daily",
      sort_order: 5,
      created_at: yesterdayStr,
    },
    {
      id: "task-6",
      title: "Read Chapter 4 of 'Designing Data-Intensive Applications'",
      description: "Take notes on schema evolution, Avro, and Protocol Buffers serialization.",
      status: "pending",
      priority: "low",
      due_date: threeDaysLater,
      reminder: false,
      project_id: "proj-learning",
      tags: ["Reading", "Architecture"],
      recurring: "weekly",
      sort_order: 6,
      created_at: yesterdayStr,
    },
    {
      id: "task-7",
      title: "Deploy Next.js 15 staging environment with Vercel",
      description: "Configure environment variables, DNS records, and verify Supabase SSL connection.",
      status: "completed",
      priority: "high",
      due_date: yesterdayStr,
      reminder: false,
      project_id: "proj-work",
      tags: ["DevOps", "Release"],
      recurring: "none",
      sort_order: 7,
      completed_at: yesterdayStr,
      created_at: yesterdayStr,
    },
    {
      id: "task-8",
      title: "Weekly grocery restock and meal prep",
      description: "Organic vegetables, chicken breast, Greek yogurt, and matcha green tea.",
      status: "completed",
      priority: "medium",
      due_date: yesterdayStr,
      reminder: false,
      project_id: "proj-personal",
      tags: ["Groceries"],
      recurring: "weekly",
      sort_order: 8,
      completed_at: yesterdayStr,
      created_at: yesterdayStr,
    },
    {
      id: "task-9",
      title: "Prepare Sprint Retrospective meeting agenda",
      description: "Gather feedback on CI/CD pipeline speeds and team capacity estimation.",
      status: "pending",
      priority: "medium",
      due_date: fiveDaysLater,
      reminder: false,
      project_id: "proj-work",
      tags: ["Agile", "Team"],
      recurring: "none",
      sort_order: 9,
      created_at: yesterdayStr,
    },
  ];
}

export const INITIAL_PROJECTS = getInitialProjects();
export const INITIAL_TASKS = getInitialTasks();

export const INITIAL_PROFILE: UserProfile = {
  id: "demo-user-123",
  email: "alex.taylor@example.com",
  display_name: "Alex Taylor",
  avatar_url: null,
  date_format: "YYYY-MM-DD",
  week_start: "monday",
  theme: "system",
  sound_effects: true,
};
