"use client";

import { SESSION_PRESETS, type SessionPreset } from "@/types";
import { cn } from "@/lib/utils";

interface DurationSelectorProps {
  duration: number;
  onChange: (duration: number) => void;
  disabled?: boolean;
  className?: string;
}

const presetOptions: { value: SessionPreset; label: string }[] = [
  { value: "15min", label: "15m" },
  { value: "30min", label: "30m" },
  { value: "45min", label: "45m" },
  { value: "60min", label: "60m" },
  { value: "90min", label: "90m" },
];

export function DurationSelector({
  duration,
  onChange,
  disabled = false,
  className,
}: DurationSelectorProps) {
  return (
    <div className={cn("w-full", className)}>
      <label className="mb-2 block text-sm font-medium text-gray-300">
        Session Duration
      </label>
      <div className="flex gap-2">
        {presetOptions.map((option) => {
          const presetDuration = SESSION_PRESETS[option.value];
          const isSelected = duration === presetDuration;

          return (
            <button
              key={option.value}
              onClick={() => onChange(presetDuration)}
              disabled={disabled}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                "border",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                isSelected
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600",
                disabled && "cursor-not-allowed opacity-50",
              )}
              aria-pressed={isSelected}
              aria-label={`Set duration to ${option.label}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
