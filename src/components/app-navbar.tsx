import React from "react"
import { Link, useLocation } from "react-router-dom"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { dashboardRoutes } from "@/routes"
import { cn } from "@/lib/utils"

interface AppNavbarProps {
  className?: string
}

export default function AppNavbar({ className }: AppNavbarProps) {
  const { pathname } = useLocation()
  const routes = React.useMemo(
    () => dashboardRoutes.flatMap((g) => g.items),
    []
  )

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {routes.map((route) => {
          const active = pathname === route.to
          return (
            <NavigationMenuItem key={route.to}>
              <NavigationMenuLink asChild>
                <Link
                  to={route.to}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    active && "bg-accent text-accent-foreground"
                  )}
                >
                  {route.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
