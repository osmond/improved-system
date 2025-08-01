import { render, screen } from "@testing-library/react";
import StateVisitCallout from "../StateVisitCallout";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useStateVisits", () => ({
  useStateVisits: () => [
    {
      stateCode: "CA",
      visited: true,
      totalDays: 0,
      totalMiles: 0,
      cities: [],
      log: [
        { date: "2025-01-01", type: "run", miles: 5 },
        { date: "2025-02-01", type: "bike", miles: 10 },
      ],
    },
    {
      stateCode: "TX",
      visited: true,
      totalDays: 0,
      totalMiles: 0,
      cities: [],
      log: [
        { date: "2024-12-31", type: "run", miles: 3 },
      ],
    },
  ],
}));

describe("StateVisitCallout", () => {
  it("shows latest activity", () => {
    render(<div className="relative h-10"><StateVisitCallout /></div>);
    expect(screen.getByText("Latest bike: 10mi in CA")).toBeInTheDocument();
  });
});
