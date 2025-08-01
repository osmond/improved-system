
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi, describe, it, expect, beforeAll } from "vitest"
import React from "react"
import PieChartDonut from "../PieChartDonut"

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  }
})

vi.mock("@/hooks/useReadingMediumTotals", () => ({
  __esModule: true,
  default: () => [
    { medium: "phone", minutes: 30 },
    { medium: "computer", minutes: 60 },
  ],
}))

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value: () => ({ width: 400, height: 300, top: 0, left: 0, bottom: 0, right: 0 }),
  })
})

describe("PieChartDonut", () => {
  it("renders chart title and arcs", () => {
    const { container } = render(<PieChartDonut />)
    expect(screen.getByText("Pie Chart - Donut")).toBeInTheDocument()
    const paths = container.querySelectorAll("path")
    expect(paths.length).toBeGreaterThan(0)
  })
})
=======
import { render, screen } from "@testing-library/react";
import PieChartDonut from "../PieChartDonut";
import "@testing-library/jest-dom";

describe("PieChartDonut", () => {
  it("renders chart title", () => {
    render(<PieChartDonut />);
    expect(screen.getByText(/Pie Chart - Donut/)).toBeInTheDocument();
  });
});

