import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import TopInsights from "../TopInsights";

vi.mock("@/hooks/useInsights", () => ({
  __esModule: true,
  default: () => ({
    activeStreak: 3,
    highHeartRate: true,
    lowSleep: true,
    calorieSurplus: true,
    quietDay: true,
    bestPaceThisMonth: null,
    mostConsistentDay: null,
  }),
}));

describe("TopInsights", () => {
  it("shows insight badges", () => {
    render(<TopInsights />);
    expect(screen.getByText("3-day streak")).toBeInTheDocument();
    expect(screen.getByText(/High heart rate/)).toBeInTheDocument();
    expect(screen.getByText(/Low sleep/)).toBeInTheDocument();
    expect(screen.getByText(/Calorie surplus/)).toBeInTheDocument();
    expect(screen.getByText(/Quiet day/)).toBeInTheDocument();
  });
});
