"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Sparkles, Database, CheckCircle2, ChevronRight, X } from "lucide-react";

interface DemoBannerProps {
  onOpenAuth: () => void;
}

export function DemoBanner({ onOpenAuth }: DemoBannerProps) {
  const { isDemoMode, user, isSupabaseReady } = useTodo();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (user && !isDemoMode) {
    return (
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Connected to Supabase PostgreSQL & Auth as <strong>{user.email}</strong>. Data is synced in real-time.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-100"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border-b border-blue-500/20 px-4 py-2 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3 h-3" />
          Demo Mode
        </span>
        <span>
          {isSupabaseReady
            ? "Running with sample data. Sign in with Supabase to sync your personal tasks."
            : "Running with browser persistence. Connect your Supabase project to enable multi-device cloud sync."}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{user ? "Account" : "Connect Supabase / Sign In"}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
