import { create } from "zustand";
import {
  type TherapyMode,
  type SessionStatus,
  DEFAULT_PREFERENCES,
} from "@/types";
import { generateId } from "@/lib/utils";

interface SessionState {
  // Session state
  sessionId: string | null;
  status: SessionStatus;
  mode: TherapyMode;
  duration: number;
  remainingTime: number;
  volume: number;
  pulseCount: number;
  visualFlicker: boolean;
  startedAt: Date | null;

  // Actions
  initSession: (config: {
    mode: TherapyMode;
    duration: number;
    volume: number;
    visualFlicker?: boolean;
  }) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
  incrementPulse: () => void;
  setVolume: (volume: number) => void;
  setMode: (mode: TherapyMode) => void;
  setDuration: (duration: number) => void;
  setVisualFlicker: (enabled: boolean) => void;
  complete: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  sessionId: null,
  status: "idle",
  mode: DEFAULT_PREFERENCES.defaultMode,
  duration: DEFAULT_PREFERENCES.defaultDuration,
  remainingTime: DEFAULT_PREFERENCES.defaultDuration,
  volume: DEFAULT_PREFERENCES.defaultVolume,
  pulseCount: 0,
  visualFlicker: false,
  startedAt: null,

  initSession: (config) =>
    set({
      sessionId: generateId(),
      mode: config.mode,
      duration: config.duration,
      remainingTime: config.duration,
      volume: config.volume,
      visualFlicker: config.visualFlicker ?? false,
      pulseCount: 0,
      status: "idle",
      startedAt: null,
    }),

  start: () =>
    set({
      status: "playing",
      startedAt: new Date(),
      sessionId: get().sessionId || generateId(),
    }),

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "playing" }),

  stop: () =>
    set({
      status: "idle",
      startedAt: null,
    }),

  reset: () => {
    const { duration } = get();
    set({
      remainingTime: duration,
      pulseCount: 0,
      status: "idle",
      startedAt: null,
      sessionId: null,
    });
  },

  tick: () => {
    const { remainingTime, status } = get();
    if (status === "playing" && remainingTime > 0) {
      set({ remainingTime: remainingTime - 1 });
    }
    if (remainingTime <= 1) {
      get().complete();
    }
  },

  incrementPulse: () => {
    const { pulseCount } = get();
    set({ pulseCount: pulseCount + 1 });
  },

  setVolume: (volume) => set({ volume }),

  setMode: (mode) => set({ mode }),

  setDuration: (duration) => {
    const { status } = get();
    if (status === "idle") {
      set({ duration, remainingTime: duration });
    }
  },

  setVisualFlicker: (enabled) => set({ visualFlicker: enabled }),

  complete: () => set({ status: "completed" }),
}));
