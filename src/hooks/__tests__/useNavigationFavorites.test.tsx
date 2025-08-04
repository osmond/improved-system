import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useNavigationFavorites from "../useNavigationFavorites";
import type { DashboardRoute } from "@/routes";
import { Star } from "lucide-react";

vi.mock("../useFavorites", () => ({
  __esModule: true,
  default: () => ({
    favorites: ["/foo"],
    toggleFavorite: vi.fn(),
  }),
}));

describe("useNavigationFavorites", () => {
  it("maps favorite paths to routes", () => {
    const routes: DashboardRoute[] = [
      { to: "/foo", label: "Foo", description: "", icon: Star },
      { to: "/bar", label: "Bar", description: "", icon: Star },
    ];
    const { result } = renderHook(() => useNavigationFavorites(routes));
    expect(result.current.favoriteRoutes).toHaveLength(1);
    expect(result.current.favoriteRoutes[0].to).toBe("/foo");
  });
});

