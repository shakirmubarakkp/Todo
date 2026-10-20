"use client";

import React from "react";
import { useTodo } from "@/lib/context/TodoContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useTodo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in-fast ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100"
              : toast.type === "error"
              ? "bg-rose-950/90 border-rose-500/30 text-rose-100"
              : "bg-slate-900/90 border-slate-700/50 text-slate-100"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <p className="text-xs sm:text-sm font-medium leading-snug truncate">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
