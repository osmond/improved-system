import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import ReadingStackSplit, { ReadingTooltip } from "../ReadingStackSplit";
import { ChartContainer } from "@/ui/chart";

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: any }) => (
      <div style={{ width: 800, height: 400 }}>
        {typeof children === "function"
          ? children({ width: 800, height: 400 })
          : React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  };
});

const mockUseReadingMediumTotals = vi.fn();

vi.mock("@/hooks/useReadingMediumTotals", () => ({
  __esModule: true,
  default: () => mockUseReadingMediumTotals(),
}));

describe("ReadingStackSplit", () => {
  beforeEach(() => {
    mockUseReadingMediumTotals.mockReturnValue({
      data: [
        { medium: "phone", minutes: 30 },
        { medium: "kindle", minutes: 60 },
      ],
      isLoading: false,
      error: null,
    });
  });

  it("renders chart title and icons", () => {
    const { container } = render(<ReadingStackSplit />);
    expect(screen.getByText(/Reading Stack Split/)).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Kindle")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-smartphone")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-book-open")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-book")).toBeInTheDocument();
  });

  it("tooltip displays medium, minutes and percentage", () => {
    const payload = [
      { name: "minutes", value: 30, payload: { medium: "phone", minutes: 30 } },
    ] as any;
    render(
      <ChartContainer
        config={{ minutes: { label: "Minutes" }, phone: { label: "Phone" } }}
      >
        {() => <ReadingTooltip active payload={payload} total={90} />}
      </ChartContainer>
    );
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/33%/)).toBeInTheDocument();
  });

  it("filters out media with zero minutes", () => {
    mockUseReadingMediumTotals.mockReturnValue({
      data: [
        { medium: "phone", minutes: 30 },
        { medium: "tablet", minutes: 0 },
        { medium: "kindle", minutes: 60 },
      ],
      isLoading: false,
      error: null,
    });
    const { container } = render(<ReadingStackSplit />);
    expect(screen.queryByText("Tablet")).not.toBeInTheDocument();
    expect(
      container.querySelector("svg.lucide-tablet")
    ).not.toBeInTheDocument();
  });
});
