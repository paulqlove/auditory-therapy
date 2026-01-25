"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface BarVisualizerProps {
  isPlaying: boolean;
  pulseCount: number;
  className?: string;
}

const BAR_COUNT = 20;

// Stable initial heights for SSR (avoids hydration mismatch)
const INITIAL_HEIGHTS = [
  30, 25, 35, 28, 32, 26, 38, 24, 36, 29, 31, 27, 33, 25, 34, 28, 30, 26, 35,
  32,
];

export function BarVisualizer({
  isPlaying,
  pulseCount,
  className,
}: BarVisualizerProps) {
  const [activeBars, setActiveBars] = useState<Set<number>>(new Set());
  const [barHeights, setBarHeights] = useState<number[]>(INITIAL_HEIGHTS);
  const [activeHeights, setActiveHeights] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 80),
  );

  // Generate random heights on client mount
  useEffect(() => {
    setBarHeights(
      Array.from({ length: BAR_COUNT }, () => 20 + Math.random() * 20),
    );
    setActiveHeights(
      Array.from({ length: BAR_COUNT }, () => 60 + Math.random() * 40),
    );
  }, []);

  const triggerPulse = useCallback(() => {
    // Randomly activate 3-7 bars
    const numBars = Math.floor(Math.random() * 5) + 3;
    const newActiveBars = new Set<number>();

    for (let i = 0; i < numBars; i++) {
      newActiveBars.add(Math.floor(Math.random() * BAR_COUNT));
    }

    setActiveBars(newActiveBars);

    // Regenerate active heights for variety
    setActiveHeights(
      Array.from({ length: BAR_COUNT }, () => 60 + Math.random() * 40),
    );

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
        const height = isActive ? activeHeights[index] : barHeights[index];

        return (
          <div
            key={index}
            className={cn(
              "w-2 rounded-t transition-all duration-[20ms]",
              isActive
                ? "bg-green-400"
                : isPlaying
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-gray-300 dark:bg-gray-700",
            )}
            style={{
              height: `${height}%`,
            }}
          />
        );
      })}
    </div>
  );
}
