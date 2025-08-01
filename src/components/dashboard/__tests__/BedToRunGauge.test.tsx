import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import BedToRunGauge from "../BedToRunGauge";
import { getSleepSessions, getRunBikeVolume } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getSleepSessions: vi.fn(),
  getRunBikeVolume: vi.fn(),
}));

describe("BedToRunGauge", () => {
  it("renders ratio once data loads", async () => {
    (getSleepSessions as any).mockResolvedValue(
      Array.from({ length: 7 }, (_, i) => ({ date: `d${i}`, timeInBed: 8 }))
    );
    (getRunBikeVolume as any).mockResolvedValue([
      { week: "w", runMiles: 0, bikeMiles: 0, runTime: 300, bikeTime: 60 },
    ]);

    render(<BedToRunGauge />);
    expect(await screen.findByText("0.11")).toBeInTheDocument();
  });
});
