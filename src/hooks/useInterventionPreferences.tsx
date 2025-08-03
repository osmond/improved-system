import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface InterventionPreferences {
  remindersEnabled: boolean;
  delayMinutes: number;
}

interface InterventionPreferencesState {
  prefs: InterventionPreferences;
  setPrefs: (update: Partial<InterventionPreferences>) => void;
}

const DEFAULT_PREFS: InterventionPreferences = {
  remindersEnabled: true,
  delayMinutes: 30,
};

const STORAGE_KEY = "intervention_prefs";
const COOKIE_NAME = "intervention_prefs";

function loadPrefs(): InterventionPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_NAME}=`))?.split("=")[1];
    if (!raw) return DEFAULT_PREFS;
    const decoded = JSON.parse(atob(raw));
    return { ...DEFAULT_PREFS, ...decoded };
  } catch {
    return DEFAULT_PREFS;
  }
}

function storePrefs(p: InterventionPreferences) {
  if (typeof window === "undefined") return;
  try {
    const encoded = btoa(JSON.stringify(p));
    localStorage.setItem(STORAGE_KEY, encoded);
    document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // ignore
  }
}

const InterventionPreferencesContext = createContext<
  InterventionPreferencesState | undefined
>(undefined);

function useProvideInterventionPreferences(): InterventionPreferencesState {
  const [prefs, setPrefsState] = useState<InterventionPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefsState(loadPrefs());
  }, []);

  const setPrefs = (update: Partial<InterventionPreferences>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...update };
      storePrefs(next);
      return next;
    });
  };

  return { prefs, setPrefs };
}

export function InterventionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useProvideInterventionPreferences();
  return (
    <InterventionPreferencesContext.Provider value={value}>
      {children}
    </InterventionPreferencesContext.Provider>
  );
}

export default function useInterventionPreferences(): InterventionPreferencesState {
  const ctx = useContext(InterventionPreferencesContext);
  const fallback = useProvideInterventionPreferences();
  return ctx || fallback;
}

