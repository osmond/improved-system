import { render, renderHook, screen } from "@testing-library/react";
import AcwrGauge from "../AcwrGauge";
import { useAcwr } from "@/hooks/useAcwr";
import { describe, it, expect } from "vitest";

describe("useAcwr", () => {
  it("computes ratio of 7d to 28d load", () => {
    const loads = Array.from({ length: 28 }, (_, i) => i + 1); // 1..28
    const { result } = renderHook(() => useAcwr(loads));
    const ratio = result.current;
    // average of last 7 = 25
    // average of last 28 = 14.5
    expect(ratio).toBeCloseTo(25 / 14.5);
  });
});

describe("AcwrGauge", () => {
  it("renders the ratio text", () => {
    const loads = Array(28).fill(10);
    render(<AcwrGauge loads={loads} />);
    expect(screen.getByText("1.00")).toBeTruthy();
  });
});
