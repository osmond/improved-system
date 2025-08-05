import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function TopNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink to="/" className="block px-2 py-1 text-sm">
              Dashboard
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {dashboardRoutes.map((group) => {
          const Icon = group.icon;
          return (
            <NavigationMenuItem key={group.label}>
              <NavigationMenuTrigger className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                <span>{group.label}</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-48 flex-col gap-2 p-4">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to={item.to}
                          className="block px-2 py-1 text-sm"
                        >
                          {item.label}
                        </NavLink>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

