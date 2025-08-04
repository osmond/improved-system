import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import StateVisitCallout from "../StateVisitCallout";

vi.mock("@/lib/api", () => ({ getStateVisits: vi.fn() }));
import { getStateVisits } from "@/lib/api";

describe("StateVisitCallout", () => {
  it("shows latest activity", async () => {
    (getStateVisits as any).mockResolvedValue([
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
        log: [{ date: "2024-12-31", type: "run", miles: 3 }],
      },
    ]);

    render(
      <div className="relative h-10">
        <StateVisitCallout onSelectState={() => {}} />
      </div>
    );
    expect(await screen.findByText(/Feb 1, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/10mi in California/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View/ })).toBeInTheDocument();
  });
});
