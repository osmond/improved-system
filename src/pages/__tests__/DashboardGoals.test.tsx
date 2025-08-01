import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { mockGarminData, mockDailySteps } from "@/lib/api";

vi.mock("@/hooks/useGarminData", () => ({
  useGarminData: () => mockGarminData,
  useMostRecentActivity: () => null,
  useGarminDays: () => mockDailySteps,
}));

vi.mock("@/pages/Examples", () => ({
  __esModule: true,
  default: () => React.createElement("div"),
}));

vi.mock("@/components/map", () => ({
  __esModule: true,
  GeoActivityExplorer: () => React.createElement("div"),
}));

vi.mock("@/components/dashboard", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    __esModule: true,
    ...actual,
    MiniSparkline: () => React.createElement("div"),
    RingDetailDialog: () => React.createElement("div"),
  };
});


vi.mock("@/hooks/useStepInsights", () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock("@/hooks/useInsights", () => ({
  __esModule: true,
  default: () => null,
}));


describe("Dashboard goals", () => {
  it("updates step ring when goal changes", async () => {
    render(<Dashboard />);
    const ring = screen.getByLabelText("Steps progress");
    const circle = ring.querySelectorAll("circle")[1];
    const initial = circle.getAttribute("stroke-dashoffset");

    fireEvent.click(screen.getByLabelText("Edit steps goal"));
    const input = await screen.findByLabelText("Daily goal") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "5000" } });
    fireEvent.submit(input.form!);

    const updated = circle.getAttribute("stroke-dashoffset");
    expect(updated).not.toBe(initial);
  });
});
