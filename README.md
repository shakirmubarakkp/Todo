# FlowTask — Smart To-Do List & Productivity Web Application

A complete, production-ready To-Do List web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL & Supabase Auth)**, inspired by modern productivity leaders like Linear and Todoist.

---

## Features

- **Linear / Todoist Inspired Design**: Sleek typography, polished dark/light themes, subtle borders, glassmorphic floating bars, and fluid micro-interactions.
- **Core Task Management**:
  - Full CRUD operations: Create, read, edit, and delete tasks (with safe confirmation modal).
  - 4 Priority tiers: **Urgent** (Crimson pulse), **High** (Amber), **Medium** (Blue), **Low** (Slate).
  - Due dates with intelligent relative labels (*Today*, *Tomorrow*, *2d overdue*).
  - Reminders & recurring task automation (*Daily*, *Weekdays*, *Weekly*, *Monthly*).
  - Multi-tag management with tag search & filtering.
  - Multi-criteria filtering: by status, priority, category/project, due date, and tags.
  - Sorting: by due date, priority, creation date, title, or custom manual order.
  - Task reordering with Move Up / Move Down controls.
- **Interactive Dashboard**:
  - Live metric cards: Total, Completed, Pending, Overdue, and Due Today.
  - Circular SVG progress indicator & completion percentage gauge.
  - Inline Quick-Add Task bar with instantaneous Enter-key submission.
  - Interactive 7-Day Velocity Chart visualizing daily task completions vs. creations.
  - Upcoming deadlines widget with 1-click completion.
  - High priority attention alert.
- **Organized Navigation**:
  - **Dashboard**: Overview metrics and quick input.
  - **My Tasks**: Complete searchable task table with comprehensive filter bar.
  - **Today**: Focused view of overdue and today's tasks.
  - **Upcoming**: Future task schedule.
  - **Completed**: Archived logbook with 1-click reopening and clear-completed option.
  - **Projects / Categories**: Workspaces with color themes, icons, and progress bars.
  - **Settings**: Theme switcher (System/Light/Dark), display name, date format, week start, audio chimes.
- **Supabase Cloud Backend**:
  - PostgreSQL database with Row Level Security (RLS) enforcing strict user isolation.
  - Email & password authentication with session persistence.
  - Automated database triggers generating default user profiles and starter projects.
- **Reliable Fallback / Demo Mode**:
  - Works out of the box with browser `localStorage` and sample data when Supabase credentials are not yet configured.
  - Unobtrusive status banner with 1-click Supabase connection and demo toggle.
- **Audio Chimes & Confetti**:
  - Web Audio API synthesized completion chime (zero external audio file dependencies).
  - Celebration confetti bursts on task completions.
- **Keyboard Shortcuts**:
  - `Cmd+K` or `Ctrl+K`: Global Command Palette for instant search and navigation.
  - `N`: Quick-open new task modal from anywhere.
  - `Esc`: Close modals and drawers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 with CSS Variables |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL with RLS) |
| **Authentication** | Supabase Auth |
| **Celebrations** | canvas-confetti + Web Audio API |
| **Deployment** | Vercel |

---

## Getting Started Locally

### 1. Prerequisites
- Node.js `v18.18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
git clone <repository-url>
cd todoapp
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If you do not have Supabase credentials yet, you can immediately start the app in Demo Mode without setting these variables).*

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
npm run build
npm run start
```

---

## Supabase Project Setup & Database Configuration

Follow these steps to set up your free Supabase PostgreSQL database:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com/) and click **Start your project**.
   - Create a new project and select your preferred region.
   - Note down your database password.

2. **Execute Database Migrations**:
   - In your Supabase Dashboard, navigate to the **SQL Editor** on the left menu.
   - Open the file [`supabase/schema.sql`](./supabase/schema.sql) in this repository.
   - Copy the entire SQL content and paste it into the Supabase SQL Editor.
   - Click **Run**. This will create:
     - `profiles` table (user settings and display name)
     - `projects` table (categories with colors and icons)
     - `tasks` table (tasks, tags, priorities, recurrence, and dates)
     - Indexes for fast querying
     - Row Level Security (RLS) policies guaranteeing users access only their own records
     - An automatic trigger on `auth.users` to generate a profile and 3 starter projects for new registrations.

3. **Obtain API Keys**:
   - In Supabase, go to **Project Settings** -> **API**.
   - Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the **anon / public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. **Configure Authentication & Redirect URLs**:
   - Go to **Authentication** -> **URL Configuration**.
   - Set **Site URL** to your local or production URL:
     - Local: `http://localhost:3000`
     - Production: `https://your-app-name.vercel.app`
   - In **Redirect URLs**, add:
     - `http://localhost:3000/**`
     - `https://your-app-name.vercel.app/**`
     - `https://*-your-team.vercel.app/**` (for preview deployments)

---

## Deployment to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete FlowTask production application"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your GitHub repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon API key
4. Click **Deploy**. Vercel will build and deploy the production application in seconds.

---

## Post-Deployment Testing Checklist

- [ ] **First-Run Experience**: App loads cleanly with zero console errors.
- [ ] **Theme Switching**: Toggle between Light, Dark, and System themes in Settings and via the sidebar icon.
- [ ] **Task Creation**: Create a task with Title, Description, Due Date, Priority, and Project.
- [ ] **Task Editing**: Edit a task and confirm changes persist.
- [ ] **Task Completion**: Check off a task, verify audio chime and confetti burst, and verify the task moves to Completed logbook.
- [ ] **Recurring Tasks**: Mark a recurring task as complete and confirm the next occurrence is automatically created.
- [ ] **Task Deletion**: Delete a task and confirm the confirmation dialog prevents accidental clicks.
- [ ] **Search & Filters**: Test title search, priority filtering, and project filtering.
- [ ] **Keyboard Shortcuts**: Test `Cmd+K` / `Ctrl+K` for the Command Palette and `N` for new task.
- [ ] **Supabase Authentication**: Sign up with a new email, verify login, and ensure tasks sync in real-time to PostgreSQL.
- [ ] **Responsive Design**: Verify layout on mobile viewports using the hamburger menu.

---

## License
MIT License. Built for high performance and modern developer standards.
