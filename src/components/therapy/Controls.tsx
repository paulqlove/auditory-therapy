"use client";

import { Play, Pause, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ControlsProps {
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
  className?: string;
}

export function Controls({
  isPlaying,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  disabled = false,
  className,
}: ControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {/* Play/Pause Button */}
      {!isPlaying ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          disabled={disabled}
          aria-label="Start session"
          className="h-14 w-14 rounded-full p-0"
        >
          <Play className="h-6 w-6 ml-0.5" />
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="lg"
          onClick={onPause}
          disabled={disabled}
          aria-label="Pause session"
          className="h-14 w-14 rounded-full p-0"
        >
          <Pause className="h-6 w-6" />
        </Button>
      )}

      {/* Stop Button */}
      <Button
        variant="danger"
        size="lg"
        onClick={onStop}
        disabled={disabled || !isPlaying}
        aria-label="Stop session"
        className="h-12 w-12 rounded-full p-0"
      >
        <Square className="h-5 w-5" />
      </Button>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset timer"
        className="h-12 w-12 rounded-full p-0"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
}
