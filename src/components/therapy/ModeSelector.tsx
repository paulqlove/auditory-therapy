"use client";

import { Waves, Radio, Combine, Headphones } from "lucide-react";
import { type TherapyMode } from "@/types";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  mode: TherapyMode;
  onChange: (mode: TherapyMode) => void;
  disabled?: boolean;
  className?: string;
}

const modes: {
  value: TherapyMode;
  label: string;
  icon: typeof Waves;
  description: string;
}[] = [
  {
    value: "clicktrain",
    label: "Click Train",
    icon: Radio,
    description: "40Hz audio pulses (PNAS study protocol)",
  },
  {
    value: "binaural",
    label: "Binaural",
    icon: Waves,
    description: "40Hz binaural beats (requires headphones)",
  },
  {
    value: "combined",
    label: "Combined",
    icon: Combine,
    description: "Both modes together for enhanced effect",
  },
];

export function ModeSelector({
  mode,
  onChange,
  disabled = false,
  className,
}: ModeSelectorProps) {
  const selectedMode = modes.find((m) => m.value === mode);
  const needsHeadphones = mode === "binaural" || mode === "combined";

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = mode === m.value;

          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg p-3 transition-all",
                "border-2",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                isSelected
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-750",
                disabled && "cursor-not-allowed opacity-50",
              )}
              aria-pressed={isSelected}
              aria-label={`${m.label}: ${m.description}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode description */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-400">{selectedMode?.description}</p>
        {needsHeadphones && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-amber-400">
            <Headphones className="h-3 w-3" />
            <span>Stereo headphones required</span>
          </div>
        )}
      </div>
    </div>
  );
}
