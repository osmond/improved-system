import { render, screen } from "@testing-library/react";
import PieChartDonut from "../PieChartDonut";
import "@testing-library/jest-dom";

describe("PieChartDonut", () => {
  it("renders chart title", () => {
    render(<PieChartDonut />);
    expect(screen.getByText(/Pie Chart - Donut/)).toBeInTheDocument();
  });
});
