"use client";

const PIXEL_SIZE = 8;
const GAP = 2;
const COLS = 40;

export function BinauralBeatsDiagram() {
  // Generate wave pattern for left ear (200Hz - slower)
  const leftWave = Array.from({ length: COLS }).map((_, col) => {
    const phase = (col / COLS) * Math.PI * 4;
    return Math.round((Math.sin(phase) + 1) * 1.5);
  });

  // Generate wave pattern for right ear (240Hz - faster)
  const rightWave = Array.from({ length: COLS }).map((_, col) => {
    const phase = (col / COLS) * Math.PI * 4.8;
    return Math.round((Math.sin(phase) + 1) * 1.5);
  });

  // Generate perceived beat pattern (40Hz - slow oscillation)
  const beatWave = Array.from({ length: COLS }).map((_, col) => {
    const phase = (col / COLS) * Math.PI * 2;
    return Math.round((Math.sin(phase) + 1) * 1.5);
  });

  const renderWave = (
    wave: number[],
    color: string,
    label: string,
    rows: number = 4,
  ) => (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-gray-500 shrink-0">{label}</span>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${PIXEL_SIZE}px)`,
          gap: `${GAP}px`,
        }}
      >
        {Array.from({ length: rows * COLS }).map((_, index) => {
          const col = index % COLS;
          const row = Math.floor(index / COLS);
          const waveRow = wave[col];
          const isWave = row === waveRow;

          return (
            <div
              key={index}
              className={`rounded-sm ${isWave ? color : "bg-gray-300 dark:bg-gray-700"}`}
              style={{ width: PIXEL_SIZE, height: PIXEL_SIZE }}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
      <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        Binaural Beats Pattern (Headphones Required)
      </p>
      <div className="space-y-3 overflow-x-auto">
        {renderWave(leftWave, "bg-green-500", "Left: 200Hz")}
        {renderWave(rightWave, "bg-cyan-400", "Right: 240Hz")}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
          {renderWave(beatWave, "bg-amber-400", "Perceived:")}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 text-center">
        Your brain perceives the 40Hz difference between the two frequencies
      </p>
    </div>
  );
}
