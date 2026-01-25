"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { type ThemeMode } from "@/types";

export function useTheme() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: "light" | "dark") => {
      root.classList.remove("light", "dark");
      root.classList.add(mode);
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Record<ThemeMode, ThemeMode> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    setTheme(nextTheme[theme]);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark:
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  };
}
