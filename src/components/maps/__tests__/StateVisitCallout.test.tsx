import { render, screen } from "@testing-library/react";
import StateVisitCallout from "../StateVisitCallout";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useStateVisits", () => ({
  useStateVisits: () => ({
    data: [
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
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe("StateVisitCallout", () => {
  it("shows latest activity", () => {
    render(
      <div className="relative h-10">
        <StateVisitCallout onSelectState={() => {}} />
      </div>
    );
    expect(screen.getByText(/Feb 1, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/10mi in California/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View/ })).toBeInTheDocument();
  });
});
