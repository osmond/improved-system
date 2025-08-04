import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RouteList from "../RouteList";
import type { DashboardRoute } from "@/routes";
import { ChartBar } from "lucide-react";
import { vi } from "vitest";
import { NavigationMenu } from "@/ui/navigation-menu";
import { MemoryRouter } from "react-router-dom";

describe("RouteList", () => {
  it("renders routes and toggles favorites", () => {
    const routes: DashboardRoute[] = [
      { to: "/foo", label: "Foo", description: "", icon: ChartBar },
    ];
    const toggle = vi.fn();
    render(
      <MemoryRouter>
        <NavigationMenu>
          <RouteList
            routes={routes}
            favorites={[]}
            toggleFavorite={toggle}
          />
        </NavigationMenu>
      </MemoryRouter>,
    );
    expect(screen.getByText("Foo")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(button);
    expect(toggle).toHaveBeenCalledWith("/foo");
  });
});

