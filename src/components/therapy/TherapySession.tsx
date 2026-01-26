"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { Settings, HelpCircle, BarChart2, Github, Brain } from "lucide-react";
import Link from "next/link";

import { Timer } from "./Timer";
import { Controls } from "./Controls";
import { ModeSelector } from "./ModeSelector";
import { DurationSelector } from "./DurationSelector";
import { SessionStats } from "./SessionStats";
import { BarVisualizer } from "@/components/visualizers/BarVisualizer";
import { PixelGridVisualizer } from "@/components/visualizers/PixelGridVisualizer";
import { VisualFlicker } from "@/components/visualizers/VisualFlicker";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

import { useSessionStore } from "@/stores/sessionStore";
import { useHistoryStore } from "@/stores/historyStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

import { KEYBOARD_SHORTCUTS, type CompletedSession } from "@/types";
import { generateId } from "@/lib/utils";

export function TherapySession() {
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session store
  const {
    status,
    mode,
    duration,
    remainingTime,
    volume,
    pulseCount,
    visualFlicker,
    sessionId,
    start: startSession,
    pause: pauseSession,
    stop: stopSession,
    reset: resetSession,
    tick,
    incrementPulse,
    setVolume,
    setMode,
    setDuration,
    setVisualFlicker,
  } = useSessionStore();

  // History store
  const addSession = useHistoryStore((state) => state.addSession);

  // Preferences
  const showOnboarding = usePreferencesStore((state) => state.showOnboarding);
  const setShowOnboarding = usePreferencesStore(
    (state) => state.setShowOnboarding,
  );

  // Apply user's default preferences on initial load (after hydration from localStorage)
  const [preferencesApplied, setPreferencesApplied] = useState(false);
  useEffect(() => {
    if (preferencesApplied || status !== "idle") return;

    // Small delay to ensure zustand has hydrated from localStorage
    const timeoutId = setTimeout(() => {
      const prefs = usePreferencesStore.getState();
      setMode(prefs.defaultMode);
      setDuration(prefs.defaultDuration);
      setVolume(prefs.defaultVolume);
      setPreferencesApplied(true);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [preferencesApplied, status, setMode, setDuration, setVolume]);

  const isPlaying = status === "playing";

  // Audio engine
  const {
    start: startAudio,
    stop: stopAudio,
    error: audioError,
  } = useAudioEngine({
    mode,
    volume,
    onPulse: incrementPulse,
  });

  // Wake lock
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

  // Handle session completion
  const handleSessionComplete = useCallback(() => {
    stopAudio();
    releaseWakeLock();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShowCompletionModal(true);
  }, [stopAudio, releaseWakeLock]);

  // Start session
  const handleStart = useCallback(async () => {
    await startAudio();
    await requestWakeLock();
    startSession();

    timerRef.current = setInterval(() => {
      tick();
    }, 1000);
  }, [startAudio, requestWakeLock, startSession, tick]);

  // Pause session
  const handlePause = useCallback(() => {
    stopAudio();
    pauseSession();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopAudio, pauseSession]);

  // Resume session
  const handleResume = useCallback(async () => {
    await startAudio();
    startSession();

    timerRef.current = setInterval(() => {
      tick();
    }, 1000);
  }, [startAudio, startSession, tick]);

  // Stop session
  const handleStop = useCallback(() => {
    stopAudio();
    releaseWakeLock();
    stopSession();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopAudio, releaseWakeLock, stopSession]);

  // Reset session
  const handleReset = useCallback(() => {
    handleStop();
    resetSession();
  }, [handleStop, resetSession]);

  // Save completed session
  const handleSaveSession = useCallback(() => {
    const completedSession: CompletedSession = {
      id: sessionId || generateId(),
      mode,
      duration,
      actualDuration: duration - remainingTime,
      completedAt: new Date().toISOString(),
      pulseCount,
      notes: sessionNotes || undefined,
      visualFlickerUsed: visualFlicker,
    };

    addSession(completedSession);
    setShowCompletionModal(false);
    setSessionNotes("");
    resetSession();
  }, [
    sessionId,
    mode,
    duration,
    remainingTime,
    pulseCount,
    sessionNotes,
    visualFlicker,
    addSession,
    resetSession,
  ]);

  // Watch for session completion
  useEffect(() => {
    if (status === "completed") {
      handleSessionComplete();
    }
  }, [status, handleSessionComplete]);

  // Volume change handler
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume / 100);
    },
    [setVolume],
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: () => {
      if (isPlaying) {
        handlePause();
      } else if (status === "paused") {
        handleResume();
      } else {
        handleStart();
      }
    },
    onReset: handleReset,
    onSwitchMode: () => {
      if (!isPlaying) {
        const modes = ["clicktrain", "binaural"] as const;
        const currentIndex = modes.indexOf(mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setMode(nextMode);
      }
    },
    onVolumeUp: () => setVolume(Math.min(1, volume + 0.1)),
    onVolumeDown: () => setVolume(Math.max(0, volume - 0.1)),
    onShowHelp: () => setShowHelp(true),
    onCloseModal: () => {
      setShowHelp(false);
      if (showCompletionModal) {
        handleSaveSession();
      }
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />

      {/* Visual Flicker Overlay */}
      <VisualFlicker isActive={isPlaying && visualFlicker} />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          40Hz Auditory Therapy
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" aria-label="View dashboard">
              <BarChart2 className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/science">
            <Button variant="ghost" size="sm" aria-label="View the science">
              <Brain className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            aria-label="Show keyboard shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <a
            href="https://github.com/paulqlove/auditory-therapy#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" aria-label="View on GitHub">
              <Github className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        {/* Error Display */}
        {audioError && (
          <div className="rounded-lg bg-red-500/10 px-4 py-2 text-red-400">
            {audioError.message}
          </div>
        )}

        {/* Timer */}
        <Timer
          remainingTime={remainingTime}
          totalTime={duration}
          isPlaying={isPlaying}
        />

        {/* Visualizer */}
        <div className="h-20 w-full max-w-md">
          {mode === "clicktrain" ? (
            <BarVisualizer isPlaying={isPlaying} pulseCount={pulseCount} />
          ) : (
            <PixelGridVisualizer isPlaying={isPlaying} />
          )}
        </div>

        {/* Controls */}
        <Controls
          isPlaying={isPlaying}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onReset={handleReset}
        />

        {/* Volume Slider */}
        <Slider
          value={volume * 100}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          label="Volume"
          disabled={false}
          className="w-full max-w-xs"
        />

        {/* Mode Selector */}
        <ModeSelector
          mode={mode}
          onChange={setMode}
          disabled={isPlaying}
          className="w-full max-w-md"
        />

        {/* Duration Selector */}
        <DurationSelector
          duration={duration}
          onChange={setDuration}
          disabled={isPlaying}
          className="w-full max-w-md"
        />

        {/* Visual Flicker Toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={visualFlicker}
            onChange={(e) => setVisualFlicker(e.target.checked)}
            disabled={isPlaying}
            className="h-4 w-4 rounded border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          />
          Enable visual flicker (40Hz screen flash)
        </label>

        {/* Session Stats */}
        <SessionStats
          pulseCount={pulseCount}
          mode={mode}
          isPlaying={isPlaying}
          className="w-full max-w-md"
        />
      </main>

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-2">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.action}
              className="flex items-center justify-between py-1"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {shortcut.description}
              </span>
              <kbd className="rounded bg-gray-200 dark:bg-gray-700 px-2 py-1 font-mono text-sm text-gray-700 dark:text-gray-300">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </Modal>

      {/* Session Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={handleSaveSession}
        title="Session Complete!"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Great work! You completed{" "}
            {Math.round((duration - remainingTime) / 60)} minutes of 40Hz
            therapy.
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Notes (optional)
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="How did you feel during this session?"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              rows={3}
            />
          </div>

          <Button onClick={handleSaveSession} className="w-full">
            Save Session
          </Button>
        </div>
      </Modal>

      {/* Settings Drawer */}
      <Drawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <SettingsPanel />
      </Drawer>
    </div>
  );
}
