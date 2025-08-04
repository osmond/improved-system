import * as React from "react";
import type { DashboardRoute } from "@/routes";
import RouteList from "./RouteList";

interface RouteGroupProps {
  label: string;
  routes: DashboardRoute[];
  favorites: string[];
  toggleFavorite: (to: string) => void;
  closeMenu?: () => void;
}

export default function RouteGroup({
  label,
  routes,
  favorites,
  toggleFavorite,
  closeMenu,
}: RouteGroupProps) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="mb-2 font-medium leading-none">{label}</h4>
      <RouteList
        routes={routes}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        closeMenu={closeMenu}
      />
    </div>
  );
}

