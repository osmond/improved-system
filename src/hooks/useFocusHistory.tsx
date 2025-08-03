import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface FocusEvent {
  timestamp: number;
  type: "detection" | "intervention";
  message: string;
}

interface FocusHistoryState {
  history: FocusEvent[];
  addEvent: (evt: Omit<FocusEvent, "timestamp"> & { timestamp?: number }) => void;
}

const STORAGE_KEY = "focus_history";

function loadHistory(): FocusEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(atob(raw)) as FocusEvent[];
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

const FocusHistoryContext = createContext<FocusHistoryState | undefined>(undefined);

function useProvideFocusHistory(): FocusHistoryState {
  const [history, setHistory] = useState<FocusEvent[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addEvent = (evt: Omit<FocusEvent, "timestamp"> & { timestamp?: number }) => {
    setHistory((prev) => {
      const next = [...prev, { ...evt, timestamp: evt.timestamp ?? Date.now() }];
      storeHistory(next);
      return next;
    });
  };

  return { history, addEvent };
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

