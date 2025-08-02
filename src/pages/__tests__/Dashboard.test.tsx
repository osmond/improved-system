import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import Dashboard from "../Dashboard";

vi.mock("@/hooks/useGarminData", () => ({
  __esModule: true,
  useGarminData: () => ({ lastSync: new Date().toISOString() }),
}));

describe("Dashboard", () => {
  it("shows fragility description", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /fragility index/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/blends training consistency/i)
    ).toBeInTheDocument();
  });
});
