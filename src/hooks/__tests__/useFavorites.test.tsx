import { renderHook, act } from "@testing-library/react";
import useFavorites from "../useFavorites";
import { describe, it, expect, beforeEach } from "vitest";

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array by default", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it("toggles and persists favorites", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite("/foo"));
    expect(result.current.favorites).toEqual(["/foo"]);
    const stored = localStorage.getItem("favorites");
    expect(stored).toBe(JSON.stringify(["/foo"]));
  });
});
