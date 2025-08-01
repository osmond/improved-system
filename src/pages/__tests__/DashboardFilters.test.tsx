import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { mockGarminData, mockDailySteps } from "@/lib/api";

vi.mock("@/hooks/useGarminData", () => ({
  useGarminData: () => mockGarminData,
  useMostRecentActivity: () => null,
  useGarminDays: () => mockDailySteps,
  useGarminDaysLazy: () => mockDailySteps,
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
  const useDashboardFilters = (await import("@/hooks/useDashboardFilters")).default;
  const StepsChartMock = () => {
    const { range } = useDashboardFilters();
    return <div data-testid="steps-chart">{range}</div>;
  };
  return {
    __esModule: true,
    ...actual,
    MiniSparkline: () => React.createElement("div"),
    RingDetailDialog: () => <StepsChartMock />, // always render chart
    StepsChart: StepsChartMock,
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

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

it("updates charts when range filter changes", async () => {
  render(
    <DashboardFiltersProvider>
      <Dashboard />
    </DashboardFiltersProvider>
  );
  expect(screen.getByTestId("steps-chart")).toHaveTextContent("30d");

  const rangeTrigger = screen.getByRole("combobox", { name: "Range" });
  fireEvent.click(rangeTrigger);
  fireEvent.click(screen.getByText("Last 7 days"));

  expect(screen.getByTestId("steps-chart")).toHaveTextContent("7d");
});

