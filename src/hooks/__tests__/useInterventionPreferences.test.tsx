import { renderHook, act } from "@testing-library/react";
import useInterventionPreferences, {
  InterventionPreferencesProvider,
} from "../useInterventionPreferences";
import { describe, it, expect, beforeEach } from "vitest";

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <InterventionPreferencesProvider>{children}</InterventionPreferencesProvider>
  );
}

describe("useInterventionPreferences", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "intervention_prefs=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  it("returns default preferences", () => {
    const { result } = renderHook(() => useInterventionPreferences(), { wrapper });
    expect(result.current.prefs).toEqual({ remindersEnabled: true, delayMinutes: 30 });
  });

  it("persists updates", () => {
    const { result, rerender } = renderHook(() => useInterventionPreferences(), { wrapper });
    act(() => {
      result.current.setPrefs({ remindersEnabled: false, delayMinutes: 45 });
    });
    rerender();
    expect(result.current.prefs.remindersEnabled).toBe(false);
    expect(result.current.prefs.delayMinutes).toBe(45);

    const stored = localStorage.getItem("intervention_prefs");
    expect(stored).toBeTruthy();
  });
});

