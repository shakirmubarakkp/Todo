import React from "react";
import { TaskPriority } from "@/types/todo";
import { AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showIcon = true, className = "" }: PriorityBadgeProps) {
  const configs = {
    urgent: {
      label: "Urgent",
      bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      icon: AlertCircle,
    },
    high: {
      label: "High",
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: ArrowUp,
    },
    medium: {
      label: "Medium",
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: Minus,
    },
    low: {
      label: "Low",
      bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
      icon: ArrowDown,
    },
  };

  const config = configs[priority] || configs.medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
