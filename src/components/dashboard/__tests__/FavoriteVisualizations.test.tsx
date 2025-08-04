import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { Star } from "lucide-react";
import FavoriteVisualizations from "../FavoriteVisualizations";

vi.mock("@/hooks/useNavigationFavorites", () => ({
  __esModule: true,
  default: () => ({
    favoriteRoutes: [
      { to: "/foo", label: "Foo", description: "", icon: Star },
    ],
  }),
}));

describe("FavoriteVisualizations", () => {
  it("renders favorite links", () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <FavoriteVisualizations />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Foo" });
    expect(link).toHaveAttribute("href", "/foo");
  });
});

