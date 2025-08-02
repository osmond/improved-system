import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useMileageTimeline from "../useMileageTimeline";
import { getMileageTimeline } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getMileageTimeline: vi.fn(),
}));

describe("useMileageTimeline", () => {
  it("accumulates weekly mileage", async () => {
    const weeks = [
      { week: "2025-W30", miles: 10, path: "a" },
      { week: "2025-W31", miles: 20, path: "b" },
      { week: "2025-W32", miles: 15, path: "c" },
    ];
    (getMileageTimeline as any).mockResolvedValue(weeks);
    const { result } = renderHook(() => useMileageTimeline());
    await waitFor(() => result.current !== null);
    expect(result.current).toEqual([
      { week: "2025-W30", cumulativeMiles: 10, path: "a" },
      { week: "2025-W31", cumulativeMiles: 30, path: "b" },
      { week: "2025-W32", cumulativeMiles: 45, path: "c" },
    ]);
  });
});
