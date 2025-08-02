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
                  defaultOpen={index === 0}
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
