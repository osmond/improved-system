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
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart2, Map as MapIcon } from "lucide-react";
import { chartRoutes, mapRoutes } from "@/routes";

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
              {chartRoutes.map((route) => (
                <SidebarMenuItem key={route.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === route.to}
                    className="justify-start"
                  >
                    <NavLink to={route.to}>
                      <BarChart2 className="mr-2" />
                      <span>{route.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
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
