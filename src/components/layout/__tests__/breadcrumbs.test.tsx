import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

describe("Breadcrumbs", () => {
  it("shows hierarchy for nested routes", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard/charts/bar-chart-interactive"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/dashboard/charts/bar-chart-interactive"
            element={<Breadcrumbs />}
          />
        </Routes>
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveTextContent("Dashboard");
    expect(links[0]).toHaveAttribute("href", "/dashboard");
    expect(links[1]).toHaveTextContent("Charts");
    expect(links[1]).toHaveAttribute("href", "/dashboard/charts");
    expect(
      screen.getByText("Customizable Metric Comparison")
    ).toBeInTheDocument();
  });

  it("allows custom labels for params", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard/user/123"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/dashboard/user/:userId"
            element={<Breadcrumbs labels={{ userId: "John Doe" }} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});

