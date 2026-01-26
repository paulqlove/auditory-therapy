"use client";

const PIXEL_SIZE = 8;
const GAP = 2;

export function ClickTrainDiagram() {
  // Timeline: 60 columns representing ~75ms (3 pulses at 25ms intervals)
  const COLS = 60;
  const ROWS = 5;

  // Pulse positions (at 0ms, 25ms, 50ms - scaled to columns)
  const pulseColumns = [2, 22, 42];

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
      <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        Click Train Pattern (1ms bursts at 40Hz)
      </p>
      <div className="flex justify-center overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, ${PIXEL_SIZE}px)`,
            gap: `${GAP}px`,
          }}
          role="img"
          aria-label="Click train visualization showing 1ms bursts of 1kHz tone every 25ms"
        >
          {Array.from({ length: ROWS * COLS }).map((_, index) => {
            const col = index % COLS;
            const row = Math.floor(index / COLS);

            // Check if this is a pulse column
            const isPulse = pulseColumns.some(
              (p) => col === p || col === p + 1,
            );

            // Bottom row is the timeline
            const isTimeline = row === ROWS - 1;

            // Middle row shows the waveform
            const isWaveformRow = row === 2;

            let bgColor = "bg-gray-300 dark:bg-gray-700"; // Default background

            if (isTimeline) {
              bgColor = "bg-gray-400 dark:bg-gray-600"; // Timeline base
              if (isPulse) {
                bgColor = "bg-green-500"; // Pulse marker on timeline
              }
            } else if (isPulse && isWaveformRow) {
              bgColor = "bg-green-500"; // Active pulse
            } else if (isPulse && (row === 1 || row === 3)) {
              bgColor = "bg-green-500/50"; // Pulse glow
            }

            return (
              <div
                key={index}
                className={`rounded-sm ${bgColor}`}
                style={{ width: PIXEL_SIZE, height: PIXEL_SIZE }}
              />
            );
          })}
        </div>
      </div>
      {/* Labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0ms</span>
        <span>25ms</span>
        <span>50ms</span>
        <span>75ms</span>
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        1ms burst of 1kHz tone, repeated every 25ms (40 times per second)
      </p>
    </div>
  );
}
