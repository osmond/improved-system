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
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Map as MapIcon, ChevronRight, Star, ChartLine } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { chartRouteGroups, mapRoutes, analyticsRoutes } from "@/routes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    () => [
      ...mapRoutes,
      ...analyticsRoutes,
      ...chartRouteGroups.flatMap((g) => g.items),
    ],
    []
  );
  const favoriteRoutes = React.useMemo(
    () =>
      favorites
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [favorites, allRoutes]
  );

  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
        {favoriteRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favoriteRoutes.map((route) => (
                  <SidebarMenuItem key={route.to}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === route.to}
                          className="justify-start"
                        >
                          <NavLink
                            to={route.to}
                            className="flex w-full items-center"
                          >
                            <span className="flex-1">{route.label}</span>
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
                      </TooltipTrigger>
                      {route.description && (
                        <TooltipContent side="right">
                          {route.description}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {chartRouteGroups.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Charts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chartRouteGroups.map((group, index) => {
                  const Icon = group.icon;
                  const contentId = `chart-group-${index}`;
                  const isOpen = openGroups[group.label] ?? index === 0;
                  return (
                    <Collapsible.Root
                      key={group.label}
                      open={isOpen}
                      onOpenChange={handleOpenChange(group.label)}
                    >
                      <SidebarMenuItem>
                        <Collapsible.Trigger asChild>
                          <SidebarMenuButton
                            className="justify-start"
                            aria-expanded={isOpen}
                            aria-controls={contentId}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {group.label}
                            <ChevronRight className="ml-auto transition-transform data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </Collapsible.Trigger>
                        <Collapsible.Content id={contentId}>
                          <SidebarMenuSub>
                            {group.items.map((route) => (
                              <SidebarMenuSubItem key={route.to}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
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
                                          {route.label}
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
                                  </TooltipTrigger>
                                  {route.description && (
                                    <TooltipContent side="right">
                                      {route.description}
                                    </TooltipContent>
                                  )}
                                </Tooltip>
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
        {analyticsRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsRoutes.map((route) => (
                  <SidebarMenuItem key={route.to}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === route.to}
                          className="justify-start"
                        >
                          <NavLink
                            to={route.to}
                            className="flex w-full items-center"
                          >
                            <ChartLine className="mr-2 h-4 w-4" />
                            <span className="flex-1">{route.label}</span>
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
                      </TooltipTrigger>
                      {route.description && (
                        <TooltipContent side="right">
                          {route.description}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {mapRoutes.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Maps</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mapRoutes.map((route) => (
                  <SidebarMenuItem key={route.to}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === route.to}
                          className="justify-start"
                        >
                          <NavLink
                            to={route.to}
                            className="flex w-full items-center"
                          >
                            <MapIcon className="mr-2" />
                            <span className="flex-1">{route.label}</span>
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
                      </TooltipTrigger>
                      {route.description && (
                        <TooltipContent side="right">
                          {route.description}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    </TooltipProvider>
  );
}
