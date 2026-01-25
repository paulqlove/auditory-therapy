"use client";

import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TimerProps {
  remainingTime: number;
  totalTime: number;
  isPlaying: boolean;
  className?: string;
}

export function Timer({
  remainingTime,
  totalTime,
  isPlaying,
  className,
}: TimerProps) {
  const progress = ((totalTime - remainingTime) / totalTime) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Time display */}
      <div
        className={cn(
          "font-mono text-7xl font-bold tracking-tight",
          "text-gray-900 dark:text-gray-100",
          isPlaying && "animate-pulse",
        )}
        role="timer"
        aria-live="polite"
        aria-label={`${formatTime(remainingTime)} remaining`}
      >
        {formatTime(remainingTime)}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-linear",
              isPlaying ? "bg-green-500" : "bg-gray-500",
            )}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Session progress"
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0:00</span>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>
    </div>
  );
}
