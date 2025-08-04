import React from "react";
import { useLocation } from "react-router-dom";
import NavSection from "@/components/nav-section";
import { SidebarContent } from "@/ui/sidebar";
import { dashboardRoutes } from "@/routes";
import useNavigationFavorites from "@/hooks/useNavigationFavorites";
import useNavigationRecent from "@/hooks/useNavigationRecent";

export default function SidebarNavigation() {
  const location = useLocation();
  const allRoutes = React.useMemo(
    () => dashboardRoutes.flatMap((g) => g.items),
    []
  );
  const { favorites, favoriteRoutes, toggleFavorite } =
    useNavigationFavorites(allRoutes);
  const { recentRoutes } = useNavigationRecent(allRoutes);
  const [highlighted, setHighlighted] = React.useState<string | null>(null);

  return (
    <SidebarContent>
      {favoriteRoutes.length > 0 && (
        <NavSection
          label="Favorites"
          routes={favoriteRoutes}
          pathname={location.pathname}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
        />
      )}
      {recentRoutes.length > 0 && (
        <NavSection
          label="Recent"
          routes={recentRoutes}
          pathname={location.pathname}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
        />
      )}
      {dashboardRoutes.map((group) => (
        <NavSection
          key={group.label}
          label={group.label}
          routes={group.items}
          icon={group.icon}
          pathname={location.pathname}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
        />
      ))}
    </SidebarContent>
  );
}

