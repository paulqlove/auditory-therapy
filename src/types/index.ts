// Therapy Mode Types
export type TherapyMode = "clicktrain" | "binaural" | "combined";

export type SessionStatus = "idle" | "playing" | "paused" | "completed";

export type ThemeMode = "light" | "dark" | "system";

// Session Duration Presets (in seconds)
export const SESSION_PRESETS = {
  "15min": 15 * 60,
  "30min": 30 * 60,
  "45min": 45 * 60,
  "60min": 60 * 60,
  "90min": 90 * 60,
} as const;

export type SessionPreset = keyof typeof SESSION_PRESETS;

// Audio Configuration
export interface AudioConfig {
  mode: TherapyMode;
  volume: number; // 0-1
  clickTrainFrequency: number; // Hz for the tone (default 1000)
  binauralLeftFrequency: number; // Hz (default 200)
  binauralRightFrequency: number; // Hz (default 240)
  pulseRate: number; // Hz (default 40)
  burstDuration: number; // ms (default 1)
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  mode: "clicktrain",
  volume: 0.3,
  clickTrainFrequency: 1000,
  binauralLeftFrequency: 200,
  binauralRightFrequency: 240,
  pulseRate: 40,
  burstDuration: 1,
};

// Session Types
export interface SessionConfig {
  mode: TherapyMode;
  duration: number; // seconds
  volume: number;
  visualFlicker: boolean;
}

export interface ActiveSession {
  id: string;
  config: SessionConfig;
  startedAt: Date;
  status: SessionStatus;
  remainingTime: number;
  pulseCount: number;
}

export interface CompletedSession {
  id: string;
  mode: TherapyMode;
  duration: number; // planned duration
  actualDuration: number; // time actually spent
  completedAt: string; // ISO date string
  pulseCount: number;
  notes?: string;
  visualFlickerUsed: boolean;
}

// History & Stats Types
export interface SessionStats {
  totalSessions: number;
  totalTimeSeconds: number;
  averageSessionLength: number;
  longestSession: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  modeBreakdown: Record<TherapyMode, number>;
}

// Preferences Types
export interface UserPreferences {
  theme: ThemeMode;
  defaultMode: TherapyMode;
  defaultDuration: number;
  defaultVolume: number;
  showOnboarding: boolean;
  audioOutputDeviceId?: string;
  reducedMotion: boolean;
  autoStartTimer: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  defaultMode: "clicktrain",
  defaultDuration: SESSION_PRESETS["60min"],
  defaultVolume: 0.3,
  showOnboarding: true,
  reducedMotion: false,
  autoStartTimer: false,
};

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string;
  description: string;
  action: string;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: "Space", description: "Play / Pause", action: "togglePlay" },
  { key: "R", description: "Reset timer", action: "reset" },
  { key: "M", description: "Switch mode", action: "switchMode" },
  { key: "↑", description: "Volume up", action: "volumeUp" },
  { key: "↓", description: "Volume down", action: "volumeDown" },
  { key: "?", description: "Show shortcuts", action: "showHelp" },
  { key: "Escape", description: "Close modal", action: "closeModal" },
];

// Export Format Types
export type ExportFormat = "json" | "csv";

export interface ExportData {
  exportedAt: string;
  version: string;
  sessions: CompletedSession[];
  stats: SessionStats;
  preferences: UserPreferences;
}

// Error Types
export interface AudioError {
  type: "context" | "device" | "permission" | "unknown";
  message: string;
  recoverable: boolean;
}

// Component Props Types
export interface TimerDisplayProps {
  remainingTime: number;
  totalTime: number;
  isPlaying: boolean;
}

export interface ControlButtonsProps {
  isPlaying: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export interface VolumeSlidertProps {
  volume: number;
  onChange: (volume: number) => void;
  disabled?: boolean;
}

export interface ModeSelectorProps {
  mode: TherapyMode;
  onChange: (mode: TherapyMode) => void;
  disabled?: boolean;
}

export interface VisualizerProps {
  isPlaying: boolean;
  mode: TherapyMode;
  pulseCount: number;
}
