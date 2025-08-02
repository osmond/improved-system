import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import Dashboard from "../Dashboard";

vi.mock("@/hooks/useGarminData", () => ({
  __esModule: true,
  useGarminData: () => ({ lastSync: new Date().toISOString() }),
}));
vi.mock("@/hooks/useRunningSessions", () => ({
  __esModule: true,
  useRunningSessions: () => null,
}));

describe("Dashboard", () => {
  it("shows fragility description", async () => {
    render(<Dashboard />);
    const sectionButton = screen.getByRole("button", {
      name: /session analysis/i,
    });
    await userEvent.click(sectionButton);
    const fragilityTab = screen.getByRole("tab", { name: /fragility/i });
    await userEvent.click(fragilityTab);
    expect(
      screen.getByRole("heading", { name: /fragility index/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/blends training consistency/i)
    ).toBeInTheDocument();
  });
});
