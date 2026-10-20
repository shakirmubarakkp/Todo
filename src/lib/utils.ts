import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateInput: string | Date | null | undefined,
  format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'YYYY-MM-DD'
): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
    default:
      return `${year}-${month}-${day}`;
  }
}

export function formatFriendlyDate(
  dateInput: string | Date | null | undefined,
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'YYYY-MM-DD'
): { label: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } {
  if (!dateInput) {
    return { label: "No due date", isOverdue: false, isToday: false, isTomorrow: false };
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return { label: "Invalid date", isOverdue: false, isToday: false, isTomorrow: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(d);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      label: daysAgo === 1 ? "Yesterday (Overdue)" : `${daysAgo}d overdue`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
    };
  } else if (diffDays === 0) {
    return { label: "Today", isOverdue: false, isToday: true, isTomorrow: false };
  } else if (diffDays === 1) {
    return { label: "Tomorrow", isOverdue: false, isToday: false, isTomorrow: true };
  } else if (diffDays > 1 && diffDays <= 6) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return {
      label: weekdays[targetDate.getDay()],
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  } else {
    return {
      label: formatDate(targetDate, dateFormat),
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  }
}

/**
 * Play a gentle synthesized sound effect for completing a task
 */
export function playCompletionSound(enabled: boolean = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pleasant two-tone chime
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Ignore audio playback limitations (e.g. before user interaction)
  }
}
