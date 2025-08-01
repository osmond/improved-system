
import { render, screen, fireEvent, act } from "@testing-library/react";

import React from "react";

import GeoActivityExplorer from "../GeoActivityExplorer";
import { vi } from "vitest";
vi.mock("react-map-gl/maplibre", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  Source: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Layer: () => null,
  Marker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
import "@testing-library/jest-dom";

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  };
});

vi.mock("@/hooks/useStateVisits", () => ({
  useStateVisits: () => [
    {
      stateCode: "CA",
      visited: true,
      totalDays: 10,
      totalMiles: 100,
      cities: [{ name: "LA", days: 4, miles: 40 }],
      log: [
        { date: new Date().toISOString().slice(0, 10), type: "run", miles: 1 },
      ],
    },
    {
      stateCode: "TX",
      visited: true,
      totalDays: 5,
      totalMiles: 50,
      cities: [{ name: "Austin", days: 5, miles: 50 }],
      log: [
        { date: new Date().toISOString().slice(0, 10), type: "run", miles: 1 },
      ],
    },
  ],
}));

vi.mock("@/hooks/useInsights", () => ({
  __esModule: true,
  default: () => ({
    activeStreak: 5,
    highHeartRate: false,
    lowSleep: false,
    calorieSurplus: false,
    quietDay: false,
    bestPaceThisMonth: null,
    mostConsistentDay: null,
  }),
}));



describe("GeoActivityExplorer", () => {
  it("toggles state details", () => {
    render(<GeoActivityExplorer />);
    const state = screen.getByLabelText("CA visited");
    expect(state).toHaveTextContent("1");
    expect(screen.queryByText("LA")).toBeNull();
    fireEvent.click(state);
    expect(screen.getAllByText("LA").length).toBeGreaterThan(0);
    fireEvent.click(state);
    expect(screen.queryByText("LA")).toBeNull();
  });

  it("renders filter selects", () => {
    render(<GeoActivityExplorer />);
    expect(screen.getAllByLabelText("Activity").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Range").length).toBeGreaterThan(0);
  });

  it("filters states by activity", () => {
    render(<GeoActivityExplorer />);
    expect(screen.getByLabelText("CA visited")).toBeInTheDocument();
    const trigger = screen.getByLabelText("Activity");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Bike"));
    expect(screen.queryByLabelText("CA visited")).not.toBeInTheDocument();
  });

  it("renders summary badges", () => {
    render(<GeoActivityExplorer />);
    expect(screen.getByText("2 states")).toBeInTheDocument();
    expect(screen.getByText("150mi")).toBeInTheDocument();
    expect(screen.getByText("Fav: CA")).toBeInTheDocument();
    expect(screen.getByText("5d streak")).toBeInTheDocument();
  });

  it("shows popup with summary when state clicked", () => {
    render(<GeoActivityExplorer />);
    const state = screen.getByLabelText("CA visited");
    fireEvent.click(state);
    expect(screen.getAllByText("1d").length).toBeGreaterThan(1);
    expect(screen.getAllByText("1mi").length).toBeGreaterThan(1);
  });

  it("filters states by search query", () => {
    vi.useFakeTimers();
    render(<GeoActivityExplorer />);
    const input = screen.getByLabelText("Search");
    fireEvent.change(input, { target: { value: "tx" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    vi.runOnlyPendingTimers();
    expect(screen.queryByLabelText("CA visited")).toBeNull();
    expect(screen.queryAllByLabelText("TX visited").length).toBeGreaterThan(0);
    vi.useRealTimers();

  });

  it("shows tooltip on state hover", async () => {
    render(<GeoActivityExplorer />);
    const map = screen.getByLabelText("state map");
    fireEvent.mouseMove(map, {
      features: [{ properties: { abbr: "CA" } }],
    } as any);
    expect(screen.getAllByText("1d", { exact: true }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("1mi", { exact: true }).length).toBeGreaterThan(0);
    fireEvent.mouseLeave(map);

  });
});
