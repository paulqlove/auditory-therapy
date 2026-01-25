"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface VisualFlickerProps {
  isActive: boolean;
  className?: string;
}

export function VisualFlicker({ isActive, className }: VisualFlickerProps) {
  const [isOn, setIsOn] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      // 40Hz = 25ms period, 12.5ms on, 12.5ms off
      intervalRef.current = setInterval(() => {
        setIsOn((prev) => !prev);
      }, 12.5);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsOn(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition-opacity duration-[12ms]",
        isOn ? "bg-white/10" : "bg-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}
