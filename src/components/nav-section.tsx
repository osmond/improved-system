import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DashboardRoute, DashboardRouteGroup } from "@/routes";
import usePersistedGroups from "@/hooks/usePersistedGroups";

interface NavSectionProps {
  label: string;
  routes?: DashboardRoute[];
  groups?: DashboardRouteGroup[];
  icon?: LucideIcon;
  pathname: string;
  favorites: string[];
  toggleFavorite: (to: string) => void;
}

export default function NavSection({
  label,
  routes,
  groups,
  icon: Icon,
  pathname,
  favorites,
  toggleFavorite,
}: NavSectionProps) {
  const storageKey = `nav_section_state_${label}`;
  const { openGroups, handleOpenChange } = usePersistedGroups(storageKey);

  if (routes?.length) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.to}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.to}
                      className="justify-start"
                    >
                      <NavLink to={route.to} className="flex w-full items-center">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
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
    );
  }

  if (groups?.length) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {groups.map((group, index) => {
              const GroupIcon = group.icon;
              const contentId = `${label}-group-${index}`;
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
                        <GroupIcon className="mr-2 h-4 w-4" />
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
    );
  }

  return null;
}

