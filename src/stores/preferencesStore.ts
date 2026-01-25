import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type UserPreferences,
  type TherapyMode,
  type ThemeMode,
  DEFAULT_PREFERENCES,
} from "@/types";

interface PreferencesState extends UserPreferences {
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setDefaultMode: (mode: TherapyMode) => void;
  setDefaultDuration: (duration: number) => void;
  setDefaultVolume: (volume: number) => void;
  setShowOnboarding: (show: boolean) => void;
  setAudioOutputDevice: (deviceId: string | undefined) => void;
  setReducedMotion: (reduced: boolean) => void;
  setAutoStartTimer: (autoStart: boolean) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setTheme: (theme) => set({ theme }),
      setDefaultMode: (mode) => set({ defaultMode: mode }),
      setDefaultDuration: (duration) => set({ defaultDuration: duration }),
      setDefaultVolume: (volume) => set({ defaultVolume: volume }),
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      setAudioOutputDevice: (deviceId) =>
        set({ audioOutputDeviceId: deviceId }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setAutoStartTimer: (autoStart) => set({ autoStartTimer: autoStart }),
      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "auditory-therapy-preferences",
      version: 1,
    },
  ),
);
