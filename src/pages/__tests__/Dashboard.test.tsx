import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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
  it("shows fragility description", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/fragility']}>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: /fragility index/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/blends training consistency/i)
    ).toBeInTheDocument();
  });
});
