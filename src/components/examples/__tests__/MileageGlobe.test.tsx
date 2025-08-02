import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MileageGlobe from "../MileageGlobe";
import useMileageTimeline from "@/hooks/useMileageTimeline";
import { vi } from "vitest";

vi.mock("@/hooks/useMileageTimeline");

describe("MileageGlobe", () => {
  const mockUseMileageTimeline = useMileageTimeline as unknown as vi.Mock;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = originalFetch;
  });

  it("renders loading placeholder when no data", () => {
    mockUseMileageTimeline.mockReturnValue(null);
    render(<MileageGlobe />);
    expect(
      screen.getByText(/Loading mileage globe.../i)
    ).toBeInTheDocument();
  });

  it("renders mileage path when data is available", async () => {
    mockUseMileageTimeline.mockReturnValue([
      {
        date: "2024-01-01",
        miles: 5,
        cumulativeMiles: 5,
        coordinates: [
          [0, 0],
          [10, 10],
        ],
      },
    ]);

    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          type: "Topology",
          objects: { countries: { type: "GeometryCollection", geometries: [] } },
        }),
    }) as any;

    const { container } = render(<MileageGlobe />);

    await waitFor(() => {
      const path = container.querySelector(
        "path[stroke='var(--primary-foreground)']",
      ) as SVGPathElement | null;
      expect(path).toBeTruthy();
      expect(path?.getAttribute("stroke-width")).toBe("2");
      expect(path?.getAttribute("stroke-linecap")).toBe("round");
    });
  });

  it("displays total mileage", async () => {
    mockUseMileageTimeline.mockReturnValue([
      {
        date: "2024-01-01",
        miles: 5,
        cumulativeMiles: 5,
        coordinates: [
          [0, 0],
          [10, 10],
        ],
      },
    ]);

    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          type: "Topology",
          objects: { countries: { type: "GeometryCollection", geometries: [] } },
        }),
    }) as any;

    render(<MileageGlobe />);

    await waitFor(() => {
      expect(screen.getByText("Total: 5 miles")).toBeInTheDocument();
    });
  });
});
