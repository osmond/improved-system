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
import { Map as MapIcon, ChevronRight } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { chartRouteGroups, mapRoutes } from "@/routes";

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

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Charts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chartRouteGroups.map((group, index) => (
                <Collapsible.Root
                  key={group.label}
                  open={openGroups[group.label] ?? index === 0}
                  onOpenChange={handleOpenChange(group.label)}
                >
                  <SidebarMenuItem>
                    <Collapsible.Trigger asChild>
                      <SidebarMenuButton className="justify-start">
                        {group.label}
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
                              <NavLink to={route.to}>{route.label}</NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </Collapsible.Content>
                  </SidebarMenuItem>
                </Collapsible.Root>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Maps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mapRoutes.map((route) => (
                <SidebarMenuItem key={route.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === route.to}
                    className="justify-start"
                  >
                    <NavLink to={route.to}>
                      <MapIcon className="mr-2" />
                      <span>{route.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
