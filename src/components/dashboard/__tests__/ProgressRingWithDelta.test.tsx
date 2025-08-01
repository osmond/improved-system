import { render, screen } from "@testing-library/react";
import ProgressRingWithDelta from "../ProgressRingWithDelta";
import "@testing-library/jest-dom";

describe("ProgressRingWithDelta", () => {
  it("adds aria-live attribute", () => {
    render(
      <ProgressRingWithDelta value={50} label="Progress" current={100} previous={80} />
    );
    const delta = screen.getByLabelText("Change from previous");
    expect(delta).toHaveAttribute("aria-live", "polite");
  });

  it("updates delta text when current changes", () => {
    const { rerender } = render(
      <ProgressRingWithDelta value={50} label="Progress" current={100} previous={80} />
    );
    expect(screen.getByText("+25.0%")).toBeInTheDocument();
    rerender(
      <ProgressRingWithDelta value={50} label="Progress" current={80} previous={80} />
    );
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });

  it("renders additional deltas", () => {
    render(
      <ProgressRingWithDelta
        value={50}
        label="Progress"
        current={100}
        previous={80}
        deltas={[{ value: 0.2, label: "vs 7d" }]}
      />
    );
    expect(screen.getByText("+20.0% vs 7d")).toBeInTheDocument();
  });
});
