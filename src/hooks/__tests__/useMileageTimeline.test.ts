import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useMileageTimeline from "../useMileageTimeline";
import { getMileageTimeline } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getMileageTimeline: vi.fn(),
}));

describe("useMileageTimeline", () => {
  it("accumulates activity mileage", async () => {
    const activities = [
      { date: "2025-07-20", miles: 10, coordinates: [[0, 0]] },
      { date: "2025-07-27", miles: 20, coordinates: [[1, 1]] },
      { date: "2025-08-03", miles: 15, coordinates: [[2, 2]] },
    ];
    (getMileageTimeline as any).mockResolvedValue(activities);
    const { result } = renderHook(() => useMileageTimeline());
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(result.current).toEqual([
      { date: "2025-07-20", miles: 10, cumulativeMiles: 10, coordinates: [[0, 0]] },
      { date: "2025-07-27", miles: 20, cumulativeMiles: 30, coordinates: [[1, 1]] },
      { date: "2025-08-03", miles: 15, cumulativeMiles: 45, coordinates: [[2, 2]] },
    ]);
  });

  it("filters activities by week range", async () => {
    const activities = [
      { date: "2025-07-20", miles: 10, coordinates: [[0, 0]] },
      { date: "2025-07-27", miles: 20, coordinates: [[1, 1]] },
      { date: "2025-08-03", miles: 15, coordinates: [[2, 2]] },
    ];
    (getMileageTimeline as any).mockResolvedValue(activities);
    const { result } = renderHook(() =>
      useMileageTimeline(undefined, { startWeek: 1, endWeek: 2 }),
    );
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(result.current).toEqual([
      { date: "2025-07-27", miles: 20, cumulativeMiles: 20, coordinates: [[1, 1]] },
      { date: "2025-08-03", miles: 15, cumulativeMiles: 35, coordinates: [[2, 2]] },
    ]);
  });
});
