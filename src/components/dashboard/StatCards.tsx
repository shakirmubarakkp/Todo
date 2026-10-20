"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { CheckCircle2, Clock, AlertTriangle, Calendar, Layers } from "lucide-react";

export function StatCards() {
  const { stats, setActiveView } = useTodo();

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      onClick: () => setActiveView("my-tasks"),
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      onClick: () => setActiveView("completed"),
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      onClick: () => setActiveView("my-tasks"),
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: stats.overdue > 0 ? "text-rose-500" : "text-slate-400",
      bg: stats.overdue > 0 ? "bg-rose-500/10 border-rose-500/30" : "bg-slate-500/10 border-slate-500/20",
      onClick: () => setActiveView("today"),
      highlight: stats.overdue > 0,
    },
    {
      title: "Due Today",
      value: stats.today,
      icon: Calendar,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      onClick: () => setActiveView("today"),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={card.onClick}
            className={`p-4 rounded-xl border bg-white dark:bg-[#111827] shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer group flex flex-col justify-between ${
              card.highlight ? "border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20" : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </span>
              {card.highlight && (
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                  Action required
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
