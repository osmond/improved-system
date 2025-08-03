import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "recentViews";
const STORAGE_EVENT = "recentViews:update";
const MAX_RECENT_VIEWS = 5;

/**
 * Manages a list of recently viewed route paths persisted in localStorage.
 *
 * Defaults to an empty array on the server for SSR safety.
 */
export function useRecentViews() {
  const [recentViews, setRecentViews] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setRecentViews(stored ? (JSON.parse(stored) as string[]) : []);
      } catch {
        setRecentViews([]);
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener(STORAGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STORAGE_EVENT, sync);
    };
  }, []);

  const addRecentView = useCallback((path: string) => {
    setRecentViews((prev) => {
      const next = [path, ...prev.filter((p) => p !== path)].slice(
        0,
        MAX_RECENT_VIEWS,
      );
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event(STORAGE_EVENT));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { recentViews, addRecentView } as const;
}

export default useRecentViews;

