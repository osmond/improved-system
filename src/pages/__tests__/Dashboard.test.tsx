import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard";

describe("Dashboard", () => {
  it("renders nested routes", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/test"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="test" element={<div>Test Route</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Test Route")).toBeInTheDocument();
  });
});
