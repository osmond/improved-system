import { renderHook, act } from "@testing-library/react";
import usePersistedGroups from "../usePersistedGroups";
import { describe, it, expect, beforeEach } from "vitest";

describe("usePersistedGroups", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty map by default", () => {
    const { result } = renderHook(() => usePersistedGroups("test_key"));
    expect(result.current.openGroups).toEqual({});
  });

  it("persists group state", () => {
    const { result } = renderHook(() => usePersistedGroups("test_key"));
    act(() => result.current.handleOpenChange("Group A")(true));
    expect(result.current.openGroups["Group A"]).toBe(true);
    const stored = JSON.parse(localStorage.getItem("test_key") || "{}");
    expect(stored["Group A"]).toBe(true);
  });
});
