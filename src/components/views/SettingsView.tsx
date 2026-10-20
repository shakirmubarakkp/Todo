"use client";

import React, { useState } from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { useTheme } from "next-themes";
import {
  Settings,
  User,
  Palette,
  Calendar,
  Volume2,
  Database,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";

interface SettingsViewProps {
  onOpenAuth: () => void;
}

export function SettingsView({ onOpenAuth }: SettingsViewProps) {
  const {
    profile,
    updateProfile,
    user,
    isSupabaseReady,
    resetToDemoData,
    showToast,
  } = useTodo();

  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [dateFormat, setDateFormat] = useState(profile.date_format || "YYYY-MM-DD");
  const [weekStart, setWeekStart] = useState(profile.week_start || "monday");
  const [soundEffects, setSoundEffects] = useState(profile.sound_effects ?? true);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      display_name: displayName.trim(),
      date_format: dateFormat,
      week_start: weekStart,
      sound_effects: soundEffects,
    });
  };

  const copyEnvSample = () => {
    const content = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key`;
    navigator.clipboard.writeText(content);
    setCopiedEnv(true);
    showToast("Copied environment template to clipboard!", "success");
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in-fast pb-12">
      <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Preferences & Settings
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your workspace experience, themes, date formats, and cloud persistence
        </p>
      </div>

      {/* 1. Account & Profile Settings */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile & Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize your public display name and account details
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="settings-display-name" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Display Name
            </label>
            <input
              id="settings-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Taylor"
              className="w-full max-w-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-mono bg-slate-100 dark:bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 max-w-md">
              {user ? user.email : profile.email}
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </section>

      {/* 2. Appearance & Theme */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your visual preference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === "light"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-semibold">Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === "dark"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-400"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === "system"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-500"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">System</span>
          </button>
        </div>
      </section>

      {/* 3. Regional & Date Preferences */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Date & Calendar Formatting
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure how dates and workweeks are displayed across the app
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          {/* Date format */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Preferred Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => {
                const nextVal = e.target.value as typeof dateFormat;
                setDateFormat(nextVal);
                updateProfile({ date_format: nextVal });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-19)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/19/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (19/10/2026)</option>
            </select>
          </div>

          {/* Week start */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Start of the Week
            </label>
            <select
              value={weekStart}
              onChange={(e) => {
                const nextVal = e.target.value as typeof weekStart;
                setWeekStart(nextVal);
                updateProfile({ week_start: nextVal });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="monday">Monday (Standard)</option>
              <option value="sunday">Sunday (US Default)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Audio Effects */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Task Audio Chimes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Play a satisfying synthesized chime and celebration confetti when completing tasks
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={soundEffects}
            onChange={(e) => {
              setSoundEffects(e.target.checked);
              updateProfile({ sound_effects: e.target.checked });
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
        </label>
      </section>

      {/* 5. Supabase Database & Cloud Sync Status */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Supabase Backend Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PostgreSQL database and Row Level Security status
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {user ? "Manage Supabase Account" : "Connect Supabase"}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Supabase Environment Configuration</span>
            {isSupabaseReady ? (
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configured & Verified
              </span>
            ) : (
              <span className="text-amber-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Awaiting .env.local keys
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Active Session</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {user ? user.email : "Local Browser Persistence (Demo Mode)"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Database Schema</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              supabase/schema.sql included in repo
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={copyEnvSample}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedEnv ? "Copied!" : "Copy .env.example template"}</span>
          </button>
        </div>
      </section>

      {/* 6. Demo Mode & Data Reset */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sample Demo Data & Reset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Restore initial tasks, projects, and sprint goals for evaluation
            </p>
          </div>

          <button
            onClick={resetToDemoData}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </section>
    </div>
  );
}
