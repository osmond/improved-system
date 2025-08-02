import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { dashboardRoutes, type DashboardRouteGroup } from "@/routes";

export default function AppSidebar() {
  return (

      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          {dashboardRoutes.map((group: DashboardRouteGroup) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <ul className="space-y-1">
                  {group.items.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-md px-3 py-2 text-sm",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted",
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
  );
}
