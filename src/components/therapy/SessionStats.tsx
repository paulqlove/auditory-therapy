"use client";

import { Activity, Clock, Zap } from "lucide-react";
import { type TherapyMode, DEFAULT_AUDIO_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface SessionStatsProps {
  pulseCount: number;
  mode: TherapyMode;
  isPlaying: boolean;
  className?: string;
}

export function SessionStats({
  pulseCount,
  mode,
  isPlaying,
  className,
}: SessionStatsProps) {
  const getFrequencyInfo = () => {
    switch (mode) {
      case "clicktrain":
        return `${DEFAULT_AUDIO_CONFIG.clickTrainFrequency}Hz tone @ 40Hz`;
      case "binaural":
        return `${DEFAULT_AUDIO_CONFIG.binauralLeftFrequency}Hz / ${DEFAULT_AUDIO_CONFIG.binauralRightFrequency}Hz`;
    }
  };

  const getPulseLabel = () => {
    return mode === "binaural" ? "Seconds" : "Pulses";
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 p-4",
        className,
      )}
    >
      {/* Pulse/Second Count */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isPlaying
              ? "bg-green-500/20 text-green-600 dark:text-green-400"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
          )}
        >
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {pulseCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{getPulseLabel()}</p>
        </div>
      </div>

      {/* Frequency Info */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isPlaying
              ? "bg-green-500/20 text-green-600 dark:text-green-400"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
          )}
        >
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            40 Hz
          </p>
          <p className="text-xs text-gray-500">{getFrequencyInfo()}</p>
        </div>
      </div>
    </div>
  );
}
