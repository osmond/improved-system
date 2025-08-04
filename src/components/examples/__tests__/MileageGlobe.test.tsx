import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
        "path[stroke='var(--color-run)']",
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
      json: () => Promise.resolve(mockWorld),
    }) as any;

    const { container } = render(<MileageGlobe />);

    await waitFor(() => {
      const runPath = container.querySelectorAll(
        "path[stroke='var(--color-run)']",
      );
      const walkPath = container.querySelectorAll(
        "path[stroke='var(--color-walk)']",
      );
      expect(runPath.length).toBe(1);
      expect(walkPath.length).toBe(1);
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
      json: () => Promise.resolve(mockWorld),
    }) as any;

    render(<MileageGlobe />);

    await waitFor(() => {
      expect(screen.getByText("Total: 5 miles")).toBeInTheDocument();
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

  it("shows tooltip when hovering a path", async () => {
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
      const path = container.querySelector(
        "path[stroke='var(--color-run)']",
      ) as SVGPathElement | null;
      expect(path).not.toBeNull();
      fireEvent.mouseEnter(path!);
      expect(screen.getByText("2024-01-01")).toBeInTheDocument();
      expect(screen.getByText("5 miles")).toBeInTheDocument();
      expect(screen.getByText("Cumulative: 5 miles")).toBeInTheDocument();
      fireEvent.mouseLeave(path!);
      expect(screen.queryByText("2024-01-01")).not.toBeInTheDocument();
    });
  });
});
