"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Flame,
  Calendar,
  TrendingUp,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useHistoryStore } from "@/stores/historyStore";
import { formatDuration, formatTime } from "@/lib/utils";
import { type CompletedSession, type TherapyMode } from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: typeof Clock;
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
          <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="text-xs text-gray-500">{label}</p>
          {subtext && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionItem({
  session,
  onDelete,
}: {
  session: CompletedSession;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const modeLabels: Record<TherapyMode, string> = {
    clicktrain: "Click Train",
    binaural: "Binaural",
  };

  const date = new Date(session.completedAt);
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {formatDuration(session.actualDuration)}
            </p>
            <p className="text-xs text-gray-500">
              {dateStr} at {timeStr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300">
            {modeLabels[session.mode]}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-300 dark:border-gray-700 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Planned Duration</p>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDuration(session.duration)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Actual Duration</p>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDuration(session.actualDuration)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                {session.mode === "binaural" ? "Seconds" : "Pulses"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {session.pulseCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Visual Flicker</p>
              <p className="text-gray-700 dark:text-gray-300">
                {session.visualFlickerUsed ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {session.notes && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Notes</p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {session.notes}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(session.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { sessions, stats, deleteSession, clearHistory } = useHistoryStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      sessions,
      stats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditory-therapy-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Mode",
      "Duration (planned)",
      "Duration (actual)",
      "Completed At",
      "Pulses",
      "Visual Flicker",
      "Notes",
    ];

    const rows = sessions.map((s) => [
      s.id,
      s.mode,
      s.duration,
      s.actualDuration,
      s.completedAt,
      s.pulseCount,
      s.visualFlickerUsed ? "Yes" : "No",
      s.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditory-therapy-sessions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={exportData}>
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Calendar}
            label="Total Sessions"
            value={stats.totalSessions}
          />
          <StatCard
            icon={Clock}
            label="Total Time"
            value={formatDuration(stats.totalTimeSeconds)}
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            subtext={`Best: ${stats.longestStreak} days`}
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Session"
            value={formatDuration(stats.averageSessionLength || 0)}
          />
        </div>

        {/* Mode Breakdown */}
        {stats.totalSessions > 0 && (
          <div className="mt-6 rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
            <h2 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Mode Breakdown
            </h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.modeBreakdown.clicktrain}
                </p>
                <p className="text-xs text-gray-500">Click Train</p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.modeBreakdown.binaural}
                </p>
                <p className="text-xs text-gray-500">Binaural</p>
              </div>
            </div>
          </div>
        )}

        {/* Session History */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Session History
            </h2>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-400"
              >
                Clear All
              </Button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No sessions yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Complete your first session to see it here
              </p>
              <Link href="/" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Start Session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {[...sessions].reverse().map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  onDelete={deleteSession}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All History?"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This will permanently delete all {sessions.length} sessions. This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearHistory();
                setShowClearConfirm(false);
              }}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
