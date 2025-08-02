import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
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
              <h4 className="mb-2 text-xs font-semibold">{group.label}</h4>
              <ul>
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
            </SidebarGroup>

          ))}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
  );
}
