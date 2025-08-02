import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard/map", label: "Map playground" },
  { to: "/dashboard/route-similarity", label: "Route similarity" },
  { to: "/dashboard/route-novelty", label: "Route novelty" },
  { to: "/dashboard/examples", label: "Analytics fun" },
  { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
  { to: "/dashboard/fragility", label: "Fragility" },
  { to: "/dashboard/session-similarity", label: "Session Similarity" },
  { to: "/dashboard/good-day", label: "Good Day" },
  { to: "/dashboard/habit-consistency", label: "Habit consistency" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 border-r p-4">
      <NavigationMenu className="flex flex-col">
        <NavigationMenuList className="flex-col space-y-1">
          {links.map((link) => (
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
