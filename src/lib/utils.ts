import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getDateString();
}

export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === getDateString(yesterday);
}

export function calculateStreak(sessions: { completedAt: string }[]): number {
  if (sessions.length === 0) return 0;

  const sortedDates = [
    ...new Set(sessions.map((s) => s.completedAt.split("T")[0])),
  ].sort((a, b) => b.localeCompare(a));

  let streak = 0;
  let currentDate = new Date();

  // Check if there's a session today
  const todayStr = getDateString(currentDate);
  if (sortedDates[0] !== todayStr) {
    // Check if there's a session yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    if (sortedDates[0] !== getDateString(currentDate)) {
      return 0; // Streak broken
    }
  }

  for (const dateStr of sortedDates) {
    const expectedDate = getDateString(currentDate);
    if (dateStr === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateStr < expectedDate) {
      break;
    }
  }

  return streak;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
