import { useState, useCallback } from "react";

/**
 * Persists a map of group labels to their open/closed state in localStorage.
 *
 * Returns an empty object on the server for SSR safety.
 */
export function usePersistedGroups(storageKey: string) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const handleOpenChange = useCallback(
    (groupLabel: string) => (open: boolean) => {
      setOpenGroups((prev) => {
        const next = { ...prev, [groupLabel]: open };
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(next));
          }
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  return { openGroups, handleOpenChange } as const;
}

export default usePersistedGroups;
