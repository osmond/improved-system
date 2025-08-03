import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getRetentionDays } from "@/lib/locationStore";

export interface FocusEvent {
  timestamp: number;
  type: "detection" | "intervention";
  message: string;
}

interface FocusHistoryState {
  history: FocusEvent[];
  addEvent: (evt: Omit<FocusEvent, "timestamp"> & { timestamp?: number }) => void;
  dismissEvent: (index: number) => void;
  dismissed: string[];
}

const STORAGE_KEY = "focus_history";
const DISMISSED_KEY = "focus_dismissed";

function pruneHistory(history: FocusEvent[], days = getRetentionDays()): FocusEvent[] {
  const cutoff = Date.now() - days * 86400000;
  return history.filter((e) => e.timestamp >= cutoff);
}

function loadHistory(): FocusEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(atob(raw)) as FocusEvent[];
    const pruned = pruneHistory(parsed);
    if (pruned.length !== parsed.length) storeHistory(pruned);
    return pruned;
  } catch {
    return [];
  }
}

function loadDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return [];
    return JSON.parse(atob(raw)) as string[];
  } catch {
    return [];
  }
}

function storeHistory(history: FocusEvent[]) {
  if (typeof window === "undefined") return;
  try {
    const encoded = btoa(JSON.stringify(history));
    localStorage.setItem(STORAGE_KEY, encoded);
  } catch {
    // ignore
  }
}

function storeDismissed(messages: string[]) {
  if (typeof window === "undefined") return;
  try {
    const encoded = btoa(JSON.stringify(messages));
    localStorage.setItem(DISMISSED_KEY, encoded);
  } catch {
    // ignore
  }
}

const FocusHistoryContext = createContext<FocusHistoryState | undefined>(undefined);

function useProvideFocusHistory(): FocusHistoryState {
  const [history, setHistory] = useState<FocusEvent[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
    setDismissed(loadDismissed());
  }, []);

  const addEvent = (evt: Omit<FocusEvent, "timestamp"> & { timestamp?: number }) => {
    setHistory((prev) => {
      const next = pruneHistory([
        ...prev,
        { ...evt, timestamp: evt.timestamp ?? Date.now() },
      ]);
      storeHistory(next);
      return next;
    });
  };

  const dismissEvent = (index: number) => {
    setHistory((prev) => {
      const evt = prev[index];
      const next = prev.filter((_, i) => i !== index);
      storeHistory(next);
      if (evt) {
        setDismissed((dprev) => {
          if (dprev.includes(evt.message)) return dprev;
          const dnext = [...dprev, evt.message];
          storeDismissed(dnext);
          return dnext;
        });
      }
      return next;
    });
  };

  return { history, addEvent, dismissEvent, dismissed };
}

export function FocusHistoryProvider({ children }: { children: ReactNode }) {
  const value = useProvideFocusHistory();
  return <FocusHistoryContext.Provider value={value}>{children}</FocusHistoryContext.Provider>;
}

export default function useFocusHistory(): FocusHistoryState {
  const ctx = useContext(FocusHistoryContext);
  const fallback = useProvideFocusHistory();
  return ctx || fallback;
}

export function exportFocusHistory(): FocusEvent[] {
  return loadHistory();
}

export function clearFocusHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DISMISSED_KEY);
}

export function purgeOldFocusHistory(days = getRetentionDays()): void {
  const history = pruneHistory(loadHistory(), days);
  storeHistory(history);
}

