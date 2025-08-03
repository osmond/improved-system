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
      const paths = container.querySelectorAll(
        "path[stroke='var(--primary-foreground)']",
      );
      expect(paths.length).toBe(1);
      const path = paths[0] as SVGPathElement | undefined;
      expect(path?.getAttribute("stroke-width")).toBe("2");
      expect(path?.getAttribute("stroke-linecap")).toBe("round");
    });
  });

  it("renders multiple mileage paths when multiple activities are provided", async () => {
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
      {
        date: "2024-01-02",
        miles: 3,
        cumulativeMiles: 8,
        coordinates: [
          [20, 20],
          [30, 30],
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
      const paths = container.querySelectorAll(
        "path[stroke='var(--primary-foreground)']",
      );
      expect(paths.length).toBe(2);
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

  it("renders fallback message when world data fails to load", async () => {
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

    global.fetch = vi.fn().mockRejectedValue(new Error("network"));

    render(<MileageGlobe />);

    await waitFor(() => {
      expect(screen.getByText(/Map unavailable/i)).toBeInTheDocument();
    });
  });
});
