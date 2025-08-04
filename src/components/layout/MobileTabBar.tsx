import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/nav/SearchBar";

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
        items: group.items,
      })),
    []
  );
  const allRoutes = React.useMemo(
    () => dashboardRoutes.flatMap((g) => g.items),
    []
  );
  const [matches, setMatches] = React.useState<string[]>([]);

  return (
    <div className={cn("border-t bg-background", className)}>
      <SearchBar routes={allRoutes} onResults={setMatches} />
      <nav role="tablist" aria-label="Dashboard navigation" className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const groupMatch = matches.some((m) =>
            tab.items.some((r) => r.to === m)
          );
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
                    : "text-muted-foreground",
                  groupMatch && "bg-accent text-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
