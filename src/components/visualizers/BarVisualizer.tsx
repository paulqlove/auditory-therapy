"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BarVisualizerProps {
  isPlaying: boolean;
  pulseCount: number;
  className?: string;
}

const BAR_COUNT = 20;

export function BarVisualizer({
  isPlaying,
  pulseCount,
  className,
}: BarVisualizerProps) {
  const [activeBars, setActiveBars] = useState<Set<number>>(new Set());

  const triggerPulse = useCallback(() => {
    // Randomly activate 3-7 bars
    const numBars = Math.floor(Math.random() * 5) + 3;
    const newActiveBars = new Set<number>();

    for (let i = 0; i < numBars; i++) {
      newActiveBars.add(Math.floor(Math.random() * BAR_COUNT));
    }

    setActiveBars(newActiveBars);

    // Reset after 20ms
    setTimeout(() => {
      setActiveBars(new Set());
    }, 20);
  }, []);

  useEffect(() => {
    if (isPlaying && pulseCount > 0) {
      triggerPulse();
    }
  }, [isPlaying, pulseCount, triggerPulse]);

  return (
    <div
      className={cn("flex h-16 items-end justify-center gap-1", className)}
      role="img"
      aria-label="Audio visualization"
    >
      {Array.from({ length: BAR_COUNT }).map((_, index) => {
        const isActive = activeBars.has(index);
        const baseHeight = 20 + Math.random() * 20;
        const activeHeight = 60 + Math.random() * 40;

        return (
          <div
            key={index}
            className={cn(
              "w-2 rounded-t transition-all duration-[20ms]",
              isActive
                ? "bg-green-400"
                : isPlaying
                  ? "bg-gray-600"
                  : "bg-gray-700",
            )}
            style={{
              height: `${isActive ? activeHeight : baseHeight}%`,
            }}
          />
        );
      })}
    </div>
  );
}
