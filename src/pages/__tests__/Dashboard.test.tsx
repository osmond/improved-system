import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import Dashboard from "../Dashboard";
import FragilityGaugePage from "../FragilityGauge";

vi.mock("@/hooks/useGarminData", () => ({
  __esModule: true,
  useGarminData: () => ({ lastSync: new Date().toISOString() }),
}));

describe("Dashboard", () => {
  it("renders fragility page via nested route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/fragility"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="fragility" element={<FragilityGaugePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /fragility index/i })
    ).toBeInTheDocument();
  });
});
