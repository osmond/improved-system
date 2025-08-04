import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useNavigationRecent from "../useNavigationRecent";
import type { DashboardRoute } from "@/routes";
import { Star } from "lucide-react";

vi.mock("../useRecentViews", () => ({
  __esModule: true,
  default: () => ({
    recentViews: ["/bar"],
  }),
}));

describe("useNavigationRecent", () => {
  it("maps recent paths to routes", () => {
    const routes: DashboardRoute[] = [
      { to: "/foo", label: "Foo", description: "", icon: Star },
      { to: "/bar", label: "Bar", description: "", icon: Star },
    ];
    const { result } = renderHook(() => useNavigationRecent(routes));
    expect(result.current.recentRoutes).toHaveLength(1);
    expect(result.current.recentRoutes[0].to).toBe("/bar");
  });
});

