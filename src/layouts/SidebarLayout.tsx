import React from "react";
import { useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/ui/sidebar";
import NavSection from "@/components/nav-section";
import { dashboardRoutes } from "@/routes";
import useNavigationFavorites from "@/hooks/useNavigationFavorites";
import useNavigationRecent from "@/hooks/useNavigationRecent";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
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
          <NavSection
            label="All"
            groups={dashboardRoutes}
            pathname={location.pathname}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
          />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

