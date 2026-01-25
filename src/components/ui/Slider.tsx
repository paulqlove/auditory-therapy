"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  formatValue = (v) => `${Math.round(v)}%`,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && (
            <label className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-gray-500 dark:text-gray-400">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className={cn(
            "w-full h-2 rounded-full appearance-none cursor-pointer",
            "bg-gray-300 dark:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Thumb styling
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-green-500",
            "[&::-webkit-slider-thumb]:shadow-lg",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-transform",
            "[&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-green-500",
            "[&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:cursor-pointer",
          )}
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, var(--slider-track, #d1d5db) ${percentage}%, var(--slider-track, #d1d5db) 100%)`,
          }}
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
