import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { cn } from "@/lib/utils";

interface MobileTabBarProps {
  className?: string;
}

export default function MobileTabBar({ className }: MobileTabBarProps) {
  const tabs = React.useMemo(
    () =>
      dashboardRoutes.map((group) => ({
        to: group.items[0]?.to ?? "/dashboard",
        label: group.label,
        icon: group.icon,
      })),
    []
  );

  return (
    <nav
      className={cn("flex border-t bg-background", className)}
      role="tablist"
      aria-label="Dashboard navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            role="tab"
            aria-label={tab.label}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 p-2 text-xs",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
