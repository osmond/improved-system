import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import useFocusHistory, { FocusHistoryProvider } from "../useFocusHistory";

function wrapper({ children }: { children: React.ReactNode }) {
  return <FocusHistoryProvider>{children}</FocusHistoryProvider>;
}

describe("useFocusHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds and dismisses events", () => {
    const { result } = renderHook(() => useFocusHistory(), { wrapper });

    act(() => {
      result.current.addEvent({ type: "intervention", message: "test" });
    });
    expect(result.current.history.length).toBe(1);

    act(() => {
      result.current.dismissEvent(0);
    });
    expect(result.current.history.length).toBe(0);
    expect(result.current.dismissed).toContain("test");
  });

  it("purges events outside retention window", async () => {
    localStorage.setItem("loc:retentionDays", "1");
    const old = {
      timestamp: Date.now() - 2 * 86400000,
      type: "detection" as const,
      message: "old",
    };
    const encoded = btoa(JSON.stringify([old]));
    localStorage.setItem("focus_history", encoded);
    const { result } = renderHook(() => useFocusHistory(), { wrapper });
    await act(async () => {});
    expect(result.current.history.length).toBe(0);
  });
});
