import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "favorites";
const STORAGE_EVENT = "favorites:update";

/**
 * Hook managing a list of favorite route paths persisted to localStorage.
 *
 * Defaults to an empty array on the server to avoid hydration mismatches.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
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
        setFavorites(stored ? (JSON.parse(stored) as string[]) : []);
      } catch {
        setFavorites([]);
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener(STORAGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STORAGE_EVENT, sync);
    };
  }, []);

  const toggleFavorite = useCallback((to: string) => {
    setFavorites((prev) => {
      const next = prev.includes(to)
        ? prev.filter((r) => r !== to)
        : [...prev, to];
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

  return { favorites, toggleFavorite } as const;
}

export default useFavorites;
