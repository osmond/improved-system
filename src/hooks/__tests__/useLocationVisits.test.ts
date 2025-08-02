import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useLocationVisits from "../useLocationVisits";
import { getLocationVisits } from "@/lib/api";
import type { LocationVisit } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getLocationVisits: vi.fn(),
}));

describe("useLocationVisits", () => {
  it("returns visits and manages loading state", async () => {
    const mockVisits: LocationVisit[] = [
      { date: "2025-07-30", placeId: "home", category: "home" },
    ];
    (getLocationVisits as any).mockResolvedValue(mockVisits);
    const { result } = renderHook(() => useLocationVisits());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.visits).toEqual(mockVisits);
  });
});
