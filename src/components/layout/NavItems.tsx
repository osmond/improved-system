import React from "react";
import { NavLink } from "react-router-dom";
import type { DashboardRouteGroup } from "@/routes";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/ui/sheet";
import { Popover, PopoverTrigger, PopoverContent } from "@/ui/popover";

interface NavItemsProps {
  groups: DashboardRouteGroup[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export default function NavItems({
  groups,
  orientation = "vertical",
  className,
}: NavItemsProps) {
  const vertical = orientation === "vertical";

  const renderLink = (
    to: string,
    label: string,
    Icon?: React.ComponentType<{ className?: string }> ,
  ) => {
    const link = (
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "group relative flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
            isActive && "active text-foreground after:scale-x-100",
          )
        }
      >
        {Icon && (
          <Icon
            className="h-4 w-4 transition-transform group-hover:scale-110"
            aria-hidden="true"
          />
        )}
        <span className="transition-colors group-hover:text-foreground">{label}</span>
      </NavLink>
    );
    return vertical ? <SheetClose asChild>{link}</SheetClose> : link;
  };

  return (
    <ul className={cn(vertical ? "flex flex-col gap-4" : "flex gap-4", className)}>
      <li>{renderLink("/", "Dashboard")}</li>
      {groups.map((group) => {
        const Icon = group.icon;
        const firstItem = group.items[0];
        if (vertical) {
          return (
            <li key={group.label}>
              {renderLink(firstItem?.to ?? "#", group.label, Icon)}
            </li>
          );
        }
        return (
          <li key={group.label}>
            <Popover>
              <PopoverTrigger asChild>
                {renderLink(firstItem?.to ?? "#", group.label, Icon)}
              </PopoverTrigger>
              <PopoverContent className="w-48 flex flex-col gap-2 bg-white p-4 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "block px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
                        isActive && "active text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </PopoverContent>
            </Popover>
          </li>
        );
      })}
    </ul>
  );
}

