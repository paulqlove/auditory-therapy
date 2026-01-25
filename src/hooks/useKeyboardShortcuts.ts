"use client";

import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onTogglePlay?: () => void;
  onReset?: () => void;
  onSwitchMode?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onShowHelp?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts(
  handlers: ShortcutHandlers,
  enabled: boolean = true,
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Don't trigger if modifier keys are pressed (except shift for ?)
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      switch (event.key) {
        case " ":
          event.preventDefault();
          handlers.onTogglePlay?.();
          break;
        case "r":
        case "R":
          if (!event.shiftKey) {
            event.preventDefault();
            handlers.onReset?.();
          }
          break;
        case "m":
        case "M":
          event.preventDefault();
          handlers.onSwitchMode?.();
          break;
        case "ArrowUp":
          event.preventDefault();
          handlers.onVolumeUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          handlers.onVolumeDown?.();
          break;
        case "?":
          event.preventDefault();
          handlers.onShowHelp?.();
          break;
        case "Escape":
          handlers.onCloseModal?.();
          break;
      }
    },
    [handlers],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
