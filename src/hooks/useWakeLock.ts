"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface UseWakeLockReturn {
  isSupported: boolean;
  isActive: boolean;
  request: () => Promise<boolean>;
  release: () => Promise<void>;
  error: string | null;
}

export function useWakeLock(): UseWakeLockReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);
  }, []);

  const request = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Wake Lock API not supported");
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setIsActive(true);
      setError(null);

      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false);
      });

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to acquire wake lock",
      );
      setIsActive(false);
      return false;
    }
  }, [isSupported]);

  const release = useCallback(async (): Promise<void> => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsActive(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to release wake lock",
        );
      }
    }
  }, []);

  // Re-acquire wake lock when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        isSupported &&
        isActive &&
        !wakeLockRef.current
      ) {
        await request();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSupported, isActive, request]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  return {
    isSupported,
    isActive,
    request,
    release,
    error,
  };
}
