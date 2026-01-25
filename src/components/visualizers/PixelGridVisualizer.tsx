"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PixelGridVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

const COLS = 30;
const ROWS = 8;
const PIXEL_SIZE = 8;
const GAP = 2;

export function PixelGridVisualizer({
  isPlaying,
  className,
}: PixelGridVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1f2937"; // gray-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = timeRef.current;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * (PIXEL_SIZE + GAP);
        const y = row * (PIXEL_SIZE + GAP);

        // Left wave (200Hz representation - slower)
        const leftPhase = (col / COLS) * Math.PI * 2 + time * 0.05;
        const leftWave = Math.sin(leftPhase);
        const leftRow = Math.floor((leftWave + 1) * 0.5 * (ROWS - 1));

        // Right wave (240Hz representation - faster)
        const rightPhase = (col / COLS) * Math.PI * 2.4 + time * 0.06;
        const rightWave = Math.sin(rightPhase);
        const rightRow = Math.floor((rightWave + 1) * 0.5 * (ROWS - 1));

        // Determine pixel color
        const isLeftWave = row === leftRow;
        const isRightWave = row === rightRow;
        const isOverlap = isLeftWave && isRightWave;

        if (isOverlap) {
          ctx.fillStyle = "#fbbf24"; // amber-400 - overlap
        } else if (isLeftWave) {
          ctx.fillStyle = "#4ade80"; // green-400 - left ear
        } else if (isRightWave) {
          ctx.fillStyle = "#22d3ee"; // cyan-400 - right ear
        } else {
          ctx.fillStyle = "#374151"; // gray-700 - background pixel
        }

        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
      }
    }

    timeRef.current += 1;

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Draw static state when not playing
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, draw]);

  const canvasWidth = COLS * (PIXEL_SIZE + GAP) - GAP;
  const canvasHeight = ROWS * (PIXEL_SIZE + GAP) - GAP;

  return (
    <div className={cn("flex justify-center", className)}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="rounded-lg"
        role="img"
        aria-label="Binaural beats wave visualization"
      />
    </div>
  );
}
