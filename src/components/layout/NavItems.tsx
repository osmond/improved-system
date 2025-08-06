import React from "react";
import { NavLink } from "react-router-dom";
import type { DashboardRouteGroup } from "@/routes";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/ui/sheet";
import { Popover, PopoverTrigger, PopoverContent } from "@/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui/accordion";

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

  if (vertical) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {renderLink("/", "Dashboard")}
        <Accordion type="multiple" className="w-full">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <AccordionItem key={group.label} value={group.label}>
                <AccordionTrigger className="group flex w-full items-center gap-2 px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  <span>{group.label}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2 pl-4">
                    {group.items.map((item) => (
                      <li key={item.to}>{renderLink(item.to, item.label)}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }

  return (
    <ul className={cn("flex gap-4", className)}>
      <li>{renderLink("/", "Dashboard")}</li>
      {groups.map((group) => {
        const Icon = group.icon;
        const firstItem = group.items[0];
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
                        "relative block px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                        isActive && "active text-foreground after:scale-x-100",
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

