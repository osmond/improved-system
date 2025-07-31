import { render, screen, fireEvent } from "@testing-library/react";
import GeoActivityExplorer from "../GeoActivityExplorer";
import { vi } from "vitest";

vi.mock("@/hooks/useStateVisits", () => ({
  useStateVisits: () => [
    {
      stateCode: "CA",
      visited: true,
      totalDays: 10,
      totalMiles: 100,
      cities: [{ name: "LA", days: 4, miles: 40 }],
    },
  ],
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

describe("GeoActivityExplorer", () => {
  it("toggles state details", () => {
    render(<GeoActivityExplorer />);
    const square = screen.getByLabelText("CA visited");
    fireEvent.click(square);
    expect(screen.getAllByText("LA").length).toBeGreaterThan(1);
    fireEvent.click(square);
    expect(screen.getAllByText("LA").length).toBe(1);
  });

  it("toggles from map click", () => {
    render(<GeoActivityExplorer />);
    const map = screen.getByTestId("state-map");
    const path = map.querySelector('[data-state="CA"]') as SVGPathElement;
    expect(path).not.toBeNull();
    fireEvent.click(path!);
    expect(screen.getByText("LA")).toBeInTheDocument();
    fireEvent.click(path!);
    expect(screen.queryByText("LA")).toBeNull();
  });
});
