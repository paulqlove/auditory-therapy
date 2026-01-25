import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CompletedSession,
  type SessionStats,
  type TherapyMode,
} from "@/types";
import { calculateStreak, getDateString } from "@/lib/utils";

interface HistoryState {
  sessions: CompletedSession[];
  stats: SessionStats;

  // Actions
  addSession: (session: CompletedSession) => void;
  updateSessionNotes: (sessionId: string, notes: string) => void;
  deleteSession: (sessionId: string) => void;
  clearHistory: () => void;
  recalculateStats: () => void;
}

const initialStats: SessionStats = {
  totalSessions: 0,
  totalTimeSeconds: 0,
  averageSessionLength: 0,
  longestSession: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  modeBreakdown: {
    clicktrain: 0,
    binaural: 0,
  },
};

function calculateStats(sessions: CompletedSession[]): SessionStats {
  if (sessions.length === 0) {
    return initialStats;
  }

  const totalTimeSeconds = sessions.reduce(
    (acc, s) => acc + s.actualDuration,
    0,
  );
  const longestSession = Math.max(...sessions.map((s) => s.actualDuration));
  const currentStreak = calculateStreak(sessions);

  // Calculate longest streak (historical)
  let longestStreak = currentStreak;
  const sortedDates = [
    ...new Set(sessions.map((s) => s.completedAt.split("T")[0])),
  ].sort();

  let tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const modeBreakdown: Record<TherapyMode, number> = {
    clicktrain: 0,
    binaural: 0,
  };

  sessions.forEach((s) => {
    // Only count modes that still exist (ignore historical "combined" sessions)
    if (s.mode in modeBreakdown) {
      modeBreakdown[s.mode]++;
    }
  });

  return {
    totalSessions: sessions.length,
    totalTimeSeconds,
    averageSessionLength: Math.round(totalTimeSeconds / sessions.length),
    longestSession,
    currentStreak,
    longestStreak,
    lastSessionDate:
      sessions.length > 0
        ? sessions[sessions.length - 1].completedAt.split("T")[0]
        : null,
    modeBreakdown,
  };
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      stats: initialStats,

      addSession: (session) => {
        const sessions = [...get().sessions, session];
        const stats = calculateStats(sessions);
        set({ sessions, stats });
      },

      updateSessionNotes: (sessionId, notes) => {
        const sessions = get().sessions.map((s) =>
          s.id === sessionId ? { ...s, notes } : s,
        );
        set({ sessions });
      },

      deleteSession: (sessionId) => {
        const sessions = get().sessions.filter((s) => s.id !== sessionId);
        const stats = calculateStats(sessions);
        set({ sessions, stats });
      },

      clearHistory: () => {
        set({ sessions: [], stats: initialStats });
      },

      recalculateStats: () => {
        const stats = calculateStats(get().sessions);
        set({ stats });
      },
    }),
    {
      name: "auditory-therapy-history",
      version: 1,
    },
  ),
);
