import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { cn } from "@/lib/utils";

interface MobileTabLayoutProps {
  children: React.ReactNode;
}

export default function MobileTabLayout({ children }: MobileTabLayoutProps) {
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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">{children}</div>
      <nav className="flex border-t bg-background md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 p-2 text-xs",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

