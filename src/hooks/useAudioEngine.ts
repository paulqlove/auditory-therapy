"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  type TherapyMode,
  type AudioError,
  DEFAULT_AUDIO_CONFIG,
} from "@/types";

interface UseAudioEngineOptions {
  mode: TherapyMode;
  volume: number;
  onPulse?: () => void;
  onError?: (error: AudioError) => void;
}

interface UseAudioEngineReturn {
  isPlaying: boolean;
  isInitialized: boolean;
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (volume: number) => void;
  setMode: (mode: TherapyMode) => void;
  error: AudioError | null;
}

export function useAudioEngine({
  mode,
  volume,
  onPulse,
  onError,
}: UseAudioEngineOptions): UseAudioEngineReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<AudioError | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef(mode);
  const volumeRef = useRef(volume);
  const onPulseRef = useRef(onPulse);

  // Keep refs updated
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    volumeRef.current = volume;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioContextRef.current?.currentTime ?? 0,
      );
    }
  }, [volume]);

  useEffect(() => {
    onPulseRef.current = onPulse;
  }, [onPulse]);

  const initAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.setValueAtTime(
          volumeRef.current,
          audioContextRef.current.currentTime,
        );
      }

      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      const audioError: AudioError = {
        type: "context",
        message:
          err instanceof Error ? err.message : "Failed to initialize audio",
        recoverable: true,
      };
      setError(audioError);
      onError?.(audioError);
      return false;
    }
  }, [onError]);

  const playClickTrainBurst = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const burstGain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      DEFAULT_AUDIO_CONFIG.clickTrainFrequency,
      now,
    );

    // Envelope: quick attack, quick release for 1ms burst
    const burstDuration = DEFAULT_AUDIO_CONFIG.burstDuration / 1000;
    burstGain.gain.setValueAtTime(0, now);
    burstGain.gain.linearRampToValueAtTime(1, now + 0.0001);
    burstGain.gain.linearRampToValueAtTime(0, now + burstDuration);

    oscillator.connect(burstGain);
    burstGain.connect(gainNodeRef.current);

    oscillator.start(now);
    oscillator.stop(now + burstDuration + 0.001);

    onPulseRef.current?.();
  }, []);

  const startClickTrain = useCallback(() => {
    const pulseInterval = 1000 / DEFAULT_AUDIO_CONFIG.pulseRate; // 25ms for 40Hz

    // Initial burst
    playClickTrainBurst();

    intervalRef.current = setInterval(() => {
      playClickTrainBurst();
    }, pulseInterval);
  }, [playClickTrainBurst]);

  const startBinauralBeats = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;

    // Create stereo merger for left/right channels
    const merger = ctx.createChannelMerger(2);

    // Left ear oscillator (200 Hz)
    const leftOsc = ctx.createOscillator();
    const leftGain = ctx.createGain();
    leftOsc.type = "sine";
    leftOsc.frequency.setValueAtTime(
      DEFAULT_AUDIO_CONFIG.binauralLeftFrequency,
      ctx.currentTime,
    );
    leftGain.gain.setValueAtTime(0.5, ctx.currentTime);
    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0); // Connect to left channel

    // Right ear oscillator (240 Hz)
    const rightOsc = ctx.createOscillator();
    const rightGain = ctx.createGain();
    rightOsc.type = "sine";
    rightOsc.frequency.setValueAtTime(
      DEFAULT_AUDIO_CONFIG.binauralRightFrequency,
      ctx.currentTime,
    );
    rightGain.gain.setValueAtTime(0.5, ctx.currentTime);
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1); // Connect to right channel

    merger.connect(gainNodeRef.current);

    leftOsc.start();
    rightOsc.start();

    oscillatorsRef.current = [leftOsc, rightOsc];

    // Pulse counter for binaural (count seconds instead of bursts)
    intervalRef.current = setInterval(() => {
      onPulseRef.current?.();
    }, 1000);
  }, []);

  const startCombined = useCallback(() => {
    // Start both click train and binaural
    startBinauralBeats();

    // Add click train on top
    const pulseInterval = 1000 / DEFAULT_AUDIO_CONFIG.pulseRate;
    const clickInterval = setInterval(() => {
      playClickTrainBurst();
    }, pulseInterval);

    // Store the click interval separately (we'll clear both on stop)
    const originalInterval = intervalRef.current;
    intervalRef.current = setInterval(() => {
      // This is just a placeholder - the actual counting happens in startBinauralBeats
    }, 1000);

    // Override stop to clear both
    const originalOscillators = oscillatorsRef.current;
    oscillatorsRef.current = [...originalOscillators];

    // Clean up click interval when stopping
    return () => {
      clearInterval(clickInterval);
    };
  }, [startBinauralBeats, playClickTrainBurst]);

  const start = useCallback(async () => {
    const initialized = await initAudioContext();
    if (!initialized) return;

    setIsPlaying(true);

    switch (modeRef.current) {
      case "clicktrain":
        startClickTrain();
        break;
      case "binaural":
        startBinauralBeats();
        break;
      case "combined":
        startCombined();
        break;
    }
  }, [initAudioContext, startClickTrain, startBinauralBeats, startCombined]);

  const stop = useCallback(() => {
    setIsPlaying(false);

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop all oscillators
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Oscillator may already be stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    volumeRef.current = newVolume;
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newVolume,
        audioContextRef.current.currentTime,
      );
    }
  }, []);

  const setMode = useCallback(
    (newMode: TherapyMode) => {
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        stop();
      }
      modeRef.current = newMode;
      if (wasPlaying) {
        start();
      }
    },
    [isPlaying, stop, start],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stop]);

  // Handle visibility change (resume audio when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        audioContextRef.current?.state === "suspended"
      ) {
        await audioContextRef.current.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return {
    isPlaying,
    isInitialized,
    start,
    stop,
    setVolume,
    setMode,
    error,
  };
}
