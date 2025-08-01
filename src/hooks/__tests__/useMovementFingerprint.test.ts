import { describe, it, expect } from "vitest";
import { computeMovementFingerprint } from "../useMovementFingerprint";
import type { HourlySteps } from "@/lib/api";

const sample: HourlySteps[] = [
  { timestamp: "2025-07-28T08:00:00Z", steps: 100 },
  { timestamp: "2025-07-29T08:00:00Z", steps: 200 },
];

describe("computeMovementFingerprint", () => {
  it("averages steps by hour", () => {
    const result = computeMovementFingerprint(sample);
    expect(result.length).toBe(24);
    const eight = result.find((p) => p.hour === 8);
    expect(eight?.steps).toBeCloseTo(150);
  });
});
