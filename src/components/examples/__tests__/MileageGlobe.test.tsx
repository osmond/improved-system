import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("renders mileage paths when data is available", async () => {
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
      const path = container.querySelector("path[stroke='var(--primary)']");
      expect(path).toBeTruthy();
    });
  });

  it("displays selected mileage when path is clicked", async () => {
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

    let path: SVGPathElement | null = null;
    await waitFor(() => {
      path = container.querySelector(
        "path[stroke='var(--primary)']",
      ) as SVGPathElement | null;
      expect(path).toBeTruthy();
    });

    fireEvent.click(path!);

    await waitFor(() => {
      expect(screen.getByText("2024-01-01: 5 miles")).toBeInTheDocument();
    });
  });
});
