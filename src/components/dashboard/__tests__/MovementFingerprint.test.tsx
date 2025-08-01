import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import MovementFingerprint from "../MovementFingerprint";

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

vi.mock("@/hooks/useMovementFingerprint", () => ({
  __esModule: true,
  default: () => [{ hour: 0, steps: 100 }],
}));

describe("MovementFingerprint", () => {
  it("renders chart title", () => {
    render(<MovementFingerprint />);
    expect(screen.getByText(/Movement Fingerprint/)).toBeInTheDocument();
  });
});
