import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FavoritesList from "../FavoritesList";
import type { DashboardRoute } from "@/routes";
import { ChartBar } from "lucide-react";
import { vi } from "vitest";
import { NavigationMenu } from "@/ui/navigation-menu";
import { MemoryRouter } from "react-router-dom";

describe("FavoritesList", () => {
  it("renders favorites and recent groups", () => {
    const route: DashboardRoute = {
      to: "/foo",
      label: "Foo",
      description: "",
      icon: ChartBar,
    };
    const toggle = vi.fn();
    render(
      <MemoryRouter>
        <NavigationMenu>
          <FavoritesList
            favoriteRoutes={[route]}
            recentRoutes={[route]}
            favorites={[]}
            toggleFavorite={toggle}
          />
        </NavigationMenu>
      </MemoryRouter>,
    );
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Recent")).toBeInTheDocument();
  });
});

