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
import { Map as MapIcon } from "lucide-react";
import { chartRouteGroups, mapRoutes } from "@/routes";

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Charts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chartRouteGroups.map((group) => (
                <SidebarMenuItem key={group.label}>
                  <SidebarMenuButton className="justify-start">
                    {group.label}
                  </SidebarMenuButton>
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
                </SidebarMenuItem>
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
