import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInput,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Map as MapIcon, ChevronRight, Star } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { chartRouteGroups, mapRoutes } from "@/routes";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { pathname } = useLocation();

  const SIDEBAR_STATE_KEY = "sidebar_group_state";
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleOpenChange = (label: string) => (open: boolean) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [label]: open };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);

  const FAVORITES_KEY = "favorites";
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (to: string) => {
    setFavorites((prev) => {
      const next = prev.includes(to)
        ? prev.filter((r) => r !== to)
        : [...prev, to];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  const allRoutes = React.useMemo(
    () => [...mapRoutes, ...chartRouteGroups.flatMap((g) => g.items)],
    []
  );
  const favoriteRoutes = React.useMemo(
    () =>
      favorites
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [favorites, allRoutes]
  );

  const highlight = React.useCallback(
    (text: string) => {
      if (!debouncedQuery) return text;
      const index = text.toLowerCase().indexOf(debouncedQuery.toLowerCase());
      if (index === -1) return text;
      return (
        <>
          {text.slice(0, index)}
          <span className="bg-sidebar-accent text-sidebar-accent-foreground rounded-sm">
            {text.slice(index, index + debouncedQuery.length)}
          </span>
          {text.slice(index + debouncedQuery.length)}
        </>
      );
    },
    [debouncedQuery]
  );

  const filteredChartGroups = React.useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return chartRouteGroups;
    return chartRouteGroups
      .map((group) => {
        if (group.label.toLowerCase().includes(q)) {
          return group;
        }
        const items = group.items.filter((item) =>
          item.label.toLowerCase().includes(q)
        );
        return items.length ? { ...group, items } : null;
      })
      .filter(Boolean) as typeof chartRouteGroups;
  }, [debouncedQuery]);

  const filteredMapRoutes = React.useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return mapRoutes;
    return mapRoutes.filter((route) =>
      route.label.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarInput
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2"
        />
        {favoriteRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favoriteRoutes.map((route) => (
                  <SidebarMenuItem key={route.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.to}
                      className="justify-start"
                    >
                      <NavLink to={route.to} className="flex w-full items-center">
                        <span className="flex-1">{highlight(route.label)}</span>
                        <Star
                          className="ml-auto h-4 w-4 fill-yellow-400 text-yellow-400"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(route.to);
                          }}
                        />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {filteredChartGroups.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Charts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredChartGroups.map((group, index) => {
                  const Icon = group.icon;
                  return (
                    <Collapsible.Root
                      key={group.label}
                      open={openGroups[group.label] ?? index === 0}
                      onOpenChange={handleOpenChange(group.label)}
                    >
                      <SidebarMenuItem>
                        <Collapsible.Trigger asChild>
                          <SidebarMenuButton className="justify-start">
                            <Icon className="mr-2 h-4 w-4" />
                            {highlight(group.label)}
                            <ChevronRight className="ml-auto transition-transform data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                          <SidebarMenuSub>
                            {group.items.map((route) => (
                              <SidebarMenuSubItem key={route.to}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === route.to}
                                  className="justify-start"
                                >
                                  <NavLink
                                    to={route.to}
                                    className="flex w-full items-center"
                                  >
                                    <span className="flex-1">
                                      {highlight(route.label)}
                                    </span>
                                    <Star
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        favorites.includes(route.to)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleFavorite(route.to);
                                      }}
                                    />
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </Collapsible.Content>
                      </SidebarMenuItem>
                    </Collapsible.Root>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {filteredMapRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Maps</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMapRoutes.map((route) => (
                  <SidebarMenuItem key={route.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.to}
                      className="justify-start"
                    >
                      <NavLink to={route.to} className="flex w-full items-center">
                        <MapIcon className="mr-2" />
                        <span className="flex-1">{highlight(route.label)}</span>
                        <Star
                          className={cn(
                            "ml-auto h-4 w-4",
                            favorites.includes(route.to)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(route.to);
                          }}
                        />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
