import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { dashboardRoutes } from "@/routes";

export default function Sidebar() {
  return (
    <aside className="w-56 border-r p-4">
      <NavigationMenu className="flex flex-col">
        <NavigationMenuList className="flex-col space-y-1">
          {dashboardRoutes.map((link) => (
            <NavigationMenuItem key={link.to}>
              <NavigationMenuLink asChild>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2 text-sm",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
