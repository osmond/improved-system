import { render, screen } from "@testing-library/react";
import TimeInBedChart from "../TimeInBedChart";
import "@testing-library/jest-dom";

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value: () => ({ width: 400, height: 300, top: 0, left: 0, bottom: 0, right: 0 }),
  });
});

describe("TimeInBedChart", () => {
  it("renders chart title and reference line", () => {
    const { container } = render(<TimeInBedChart />);
    expect(screen.getByText("Time in Bed")).toBeInTheDocument();
    // reference line uses a dashed stroke
    const refLine = container.querySelector("line[stroke-dasharray='4 4']");
    expect(refLine).toBeTruthy();
  });
});
