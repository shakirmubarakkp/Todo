"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { Zap } from "lucide-react";

export function CompletionGauge() {
  const { stats } = useTodo();
  const rate = stats.completionRate;

  // SVG circle calculations
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  let message = "Get started! Every task checked off moves you forward.";
  let badgeText = "In Progress";
  let badgeColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";

  if (rate === 100 && stats.total > 0) {
    message = "Incredible job! All tasks completed. Time to celebrate!";
    badgeText = "All Done! 🎉";
    badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  } else if (rate >= 75) {
    message = "Outstanding momentum! You're in the final stretch.";
    badgeText = "High Productivity";
    badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  } else if (rate >= 50) {
    message = "Halfway there! Keep up the focused flow.";
    badgeText = "Halfway";
    badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  } else if (stats.total === 0) {
    message = "Your list is empty. Add your first task above to start tracking!";
    badgeText = "Fresh Start";
    badgeColor = "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        {/* Circular Progress Gauge */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Active progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {rate}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Task Completion Rate
            </h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {badgeText}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {message}
          </p>
          <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong>{stats.completed}</strong> completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <strong>{stats.pending}</strong> remaining
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">Productivity Focus</p>
          <p className="text-slate-500 dark:text-slate-400">
            {stats.today} tasks due today
          </p>
        </div>
      </div>
    </div>
  );
}
