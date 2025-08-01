import { render, renderHook, screen, fireEvent } from "@testing-library/react";
import AcwrGauge from "../AcwrGauge";
import { useAcwr } from "@/hooks/useAcwr";
import { describe, it, expect, vi } from "vitest";

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

  it("shows tooltip explanation", () => {
    vi.useFakeTimers();
    const loads = Array(28).fill(10);
    render(<AcwrGauge loads={loads} />);
    const gauge = screen.getByRole("img", { name: "ACWR 1.00" });
    gauge.setAttribute("tabIndex", "0");
    fireEvent.focus(gauge);
    vi.advanceTimersByTime(1);
    expect(
      screen.getAllByText(
        "ACWR compares last 7 days of load vs last 28; 0.8–1.3 is ideal",
      ).length,
    ).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
