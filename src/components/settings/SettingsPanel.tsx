"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useTheme } from "@/hooks/useTheme";
import { SESSION_PRESETS, type TherapyMode, type ThemeMode } from "@/types";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const {
    defaultMode,
    defaultDuration,
    defaultVolume,
    reducedMotion,
    audioOutputDeviceId,
    setDefaultMode,
    setDefaultDuration,
    setDefaultVolume,
    setReducedMotion,
    setAudioOutputDevice,
    resetPreferences,
  } = usePreferencesStore();

  const { theme, setTheme } = useTheme();
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  // Get available audio output devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter(
          (d) => d.kind === "audiooutput" && d.label,
        );
        setAudioDevices(outputs);
      } catch {
        // Not supported
        console.log("Could not enumerate audio devices");
      }
    };

    getDevices();
  }, []);

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] =
    [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Monitor },
    ];

  const modeOptions = [
    { value: "clicktrain", label: "Click Train" },
    { value: "binaural", label: "Binaural Beats" },
  ];

  const durationOptions = Object.entries(SESSION_PRESETS).map(
    ([key, value]) => ({
      value: value.toString(),
      label: key.replace("min", " minutes"),
    }),
  );

  return (
    <div className="space-y-8 p-6">
      {/* Appearance */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Appearance
        </h2>

        <div className="space-y-4">
          {/* Theme Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="flex gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all",
                      "border",
                      isSelected
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Reduced Motion
              </p>
              <p className="text-sm text-gray-500">
                Minimize animations and visual effects
              </p>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="h-5 w-5 rounded border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            />
          </label>
        </div>
      </section>

      {/* Session Defaults */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Session Defaults
        </h2>

        <div className="space-y-4">
          <Select
            label="Default Mode"
            value={defaultMode}
            onChange={(value) => setDefaultMode(value as TherapyMode)}
            options={modeOptions}
          />

          <Select
            label="Default Duration"
            value={defaultDuration.toString()}
            onChange={(value) => setDefaultDuration(parseInt(value))}
            options={durationOptions}
          />

          <Slider
            label="Default Volume"
            value={defaultVolume * 100}
            onChange={(value) => setDefaultVolume(value / 100)}
            min={0}
            max={100}
          />
        </div>
      </section>

      {/* Audio */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Audio
        </h2>

        <div className="space-y-4">
          {audioDevices.length > 0 ? (
            <Select
              label="Output Device"
              value={audioOutputDeviceId || "default"}
              onChange={(value) =>
                setAudioOutputDevice(value === "default" ? undefined : value)
              }
              options={[
                { value: "default", label: "System Default" },
                ...audioDevices
                  .filter((d) => d.deviceId !== "default")
                  .map((d) => ({
                    value: d.deviceId,
                    label: d.label || `Device ${d.deviceId.slice(0, 8)}`,
                  })),
              ]}
            />
          ) : (
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Volume2 className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Audio Output</p>
                  <p className="text-xs text-gray-500">
                    Using system default output
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reset */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Reset
        </h2>

        <Button
          variant="secondary"
          onClick={resetPreferences}
          className="w-full"
        >
          Reset All Settings to Defaults
        </Button>
      </section>

      {/* About */}
      <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          About
        </h2>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            40Hz Auditory Therapy
          </p>
          <p className="mt-1 text-sm text-gray-500">Version 1.0.0</p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Based on scientific research demonstrating the potential benefits of
            40Hz gamma entrainment for cognitive enhancement and neural health.
          </p>
        </div>
      </section>
    </div>
  );
}
