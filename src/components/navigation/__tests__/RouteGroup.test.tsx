import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RouteGroup from "../RouteGroup";
import type { DashboardRoute } from "@/routes";
import { ChartBar } from "lucide-react";
import { vi } from "vitest";
import { NavigationMenu } from "@/ui/navigation-menu";
import { MemoryRouter } from "react-router-dom";

describe("RouteGroup", () => {
  it("renders group label and routes", () => {
    const routes: DashboardRoute[] = [
      { to: "/foo", label: "Foo", description: "", icon: ChartBar },
    ];
    const toggle = vi.fn();
    render(
      <MemoryRouter>
        <NavigationMenu>
          <RouteGroup
            label="Group"
            routes={routes}
            favorites={[]}
            toggleFavorite={toggle}
          />
        </NavigationMenu>
      </MemoryRouter>,
    );
    expect(screen.getByText("Group")).toBeInTheDocument();
    expect(screen.getByText("Foo")).toBeInTheDocument();
  });
});

