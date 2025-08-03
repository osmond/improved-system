import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import ReadingStackSplit from "../ReadingStackSplit";

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  };
});

vi.mock("@/hooks/useReadingMediumTotals", () => ({
  __esModule: true,
  default: () => [
    { medium: "phone", minutes: 30 },
    { medium: "kindle", minutes: 60 },
  ],
}));

describe("ReadingStackSplit", () => {
  it("renders chart title and icons", () => {
    const { container } = render(<ReadingStackSplit />);
    expect(screen.getByText(/Reading Stack Split/)).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Kindle")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-smartphone")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-book-open")).toBeInTheDocument();
  });
});
