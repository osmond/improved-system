import { useState, useCallback } from "react";

const STORAGE_KEY = "favorites";

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

  const toggleFavorite = useCallback((to: string) => {
    setFavorites((prev) => {
      const next = prev.includes(to)
        ? prev.filter((r) => r !== to)
        : [...prev, to];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
