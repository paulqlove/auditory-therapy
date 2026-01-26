"use client";

interface StatHighlightProps {
  value: string;
  label: string;
  className?: string;
}

export function StatHighlight({ value, label, className }: StatHighlightProps) {
  return (
    <div className={`text-center ${className || ""}`}>
      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
