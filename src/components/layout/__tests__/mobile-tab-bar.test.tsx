import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MobileTabBar from "../MobileTabBar";
import { dashboardRoutes } from "@/routes";

describe("MobileTabBar", () => {
  const firstPath = dashboardRoutes[0].items[0].to;
  const firstLabel = dashboardRoutes[0].label;
  const secondPath = dashboardRoutes[1].items[0].to;
  const secondLabel = dashboardRoutes[1].label;

  it("highlights active tab", () => {
    render(
      <MemoryRouter
        initialEntries={[firstPath]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MobileTabBar />
      </MemoryRouter>
    );
    const firstTab = screen.getByRole("tab", { name: firstLabel });
    expect(firstTab).toHaveAttribute("aria-current", "page");
  });

  it("switches routes on click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={[firstPath]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MobileTabBar />
        <Routes>
          <Route path={firstPath} element={<div>First Page</div>} />
          <Route path={secondPath} element={<div>Second Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    await user.click(screen.getByRole("tab", { name: secondLabel }));
    expect(screen.getByText("Second Page")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: secondLabel })
    ).toHaveAttribute("aria-current", "page");
  });

  it("highlights tabs from search results", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={[firstPath]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MobileTabBar />
      </MemoryRouter>
    );
    const input = screen.getByRole("searchbox", { name: /search routes/i });
    await user.type(input, "fragility");
    const analyticalTab = screen.getByRole("tab", { name: /Analytical/ });
    expect(analyticalTab).toHaveClass("bg-accent");
    await user.clear(input);
    expect(analyticalTab).not.toHaveClass("bg-accent");
  });
});
