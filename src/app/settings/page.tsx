"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
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
            Settings
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-md">
        <SettingsPanel />
      </main>
    </div>
  );
}
