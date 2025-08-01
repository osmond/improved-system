import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GeoActivityExplorer from "../GeoActivityExplorer";
import { vi } from "vitest";
vi.mock("react-map-gl/maplibre", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Source: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Layer: () => null,
  Marker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
import "@testing-library/jest-dom";

vi.mock("@/hooks/useStateVisits", () => ({
  useStateVisits: () => [
    {
      stateCode: "CA",
      visited: true,
      totalDays: 10,
      totalMiles: 100,
      cities: [{ name: "LA", days: 4, miles: 40 }],
      log: [
        { date: new Date().toISOString().slice(0, 10), type: "run", miles: 1 },
      ],
    },
  ],
}));



describe("GeoActivityExplorer", () => {
  it("toggles state details", () => {
    render(<GeoActivityExplorer />);
    const state = screen.getByLabelText("CA visited");
    expect(screen.queryByText("LA")).toBeNull();
    fireEvent.click(state);
    expect(screen.getAllByText("LA").length).toBeGreaterThan(0);
    fireEvent.click(state);
    expect(screen.queryByText("LA")).toBeNull();
  });

  it("renders filter selects", () => {
    render(<GeoActivityExplorer />);
    expect(screen.getAllByLabelText("Activity").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Range").length).toBeGreaterThan(0);
  });

  it("filters states by activity", () => {
    render(<GeoActivityExplorer />);
    expect(screen.getByLabelText("CA visited")).toBeInTheDocument();
    const trigger = screen.getByLabelText("Activity");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Bike"));
    expect(screen.queryByLabelText("CA visited")).not.toBeInTheDocument();
  });

  it("highlights row on hover", async () => {
    render(<GeoActivityExplorer />);
    const row = screen.getByText("CA").closest("button")!;
    fireEvent.mouseEnter(row);
    await waitFor(() => expect(row.className).toContain("bg-primary/20"));
    fireEvent.mouseLeave(row);
    expect(row.className).not.toContain("bg-primary/20");
  });

});
