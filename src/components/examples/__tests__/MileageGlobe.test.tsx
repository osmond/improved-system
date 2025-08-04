import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MileageGlobe from "../MileageGlobe";
import useMileageTimeline from "@/hooks/useMileageTimeline";
import { vi } from "vitest";

vi.mock("@/hooks/useMileageTimeline");

describe("MileageGlobe", () => {
  const mockUseMileageTimeline = useMileageTimeline as unknown as vi.Mock;
  const originalFetch = global.fetch;
  const mockWorld = {
    type: "Topology",
    transform: { scale: [1, 1], translate: [0, 0] },
    arcs: [[[0, 0], [10, 0], [0, 10], [-10, 0], [0, -10]]],
    objects: {
      countries: {
        type: "GeometryCollection",
        geometries: [{ type: "Polygon", arcs: [[0]] }],
      },
    },
  };

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
      json: () => Promise.resolve(mockWorld),
    }) as any;

    const { container } = render(<MileageGlobe />);

    await waitFor(() => {
      const land = container.querySelectorAll("path[fill='var(--muted)']");
      expect(land.length).toBeGreaterThan(0);
      const paths = container.querySelectorAll(
        "path[stroke='var(--primary-foreground)']",
      );
      expect(paths.length).toBe(1);
      const path = paths[0] as SVGPathElement | undefined;
      expect(path?.getAttribute("stroke-width")).toBe("2");
      expect(path?.getAttribute("stroke-linecap")).toBe("round");
    });
  });

  it("renders a single path even with multiple activities", async () => {
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
      json: () => Promise.resolve(mockWorld),
    }) as any;

    const { container } = render(<MileageGlobe />);

    await waitFor(() => {
      const paths = container.querySelectorAll(
        "path[stroke='var(--primary-foreground)']",
      );
      expect(paths.length).toBe(1);
    });
  });

  it("does not display total mileage text", async () => {
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
      json: () => Promise.resolve(mockWorld),
    }) as any;

    render(<MileageGlobe />);

    await waitFor(() => {
      expect(screen.queryByText(/Total:/i)).toBeNull();
    });
  });

  it("shows map unavailable when world data fails to load", async () => {
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
      expect(screen.getByText("Map unavailable")).toBeInTheDocument();
    });
  });

  // Tooltip behavior is no longer applicable with a single aggregated path
});
