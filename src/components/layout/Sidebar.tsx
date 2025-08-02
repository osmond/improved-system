import React from "react";
import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { dashboardRoutes } from "@/routes";

export default function AppSidebar() {
  return (
    <SidebarRoot>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          {dashboardRoutes.map((link) => (
            <SidebarItem key={link.to}>
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
            </SidebarItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </SidebarRoot>
  );
}
