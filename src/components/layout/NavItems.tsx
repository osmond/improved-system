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
import { LayoutDashboard, Search } from "lucide-react";

interface NavItemsProps {
  groups: DashboardRouteGroup[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  closeOnLinkClick?: boolean;
}

export default function NavItems({
  groups,
  orientation = "vertical",
  className,
  closeOnLinkClick = false,
}: NavItemsProps) {
  const vertical = orientation === "vertical";
  const [query, setQuery] = React.useState("");
  const linkRefs = React.useRef<Array<HTMLAnchorElement | null>>([]);

  const filteredGroups = React.useMemo(() => {
    if (!query) return groups;
    const lower = query.toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(lower),
        ),
      }))
      .filter(
        (group) =>
          group.items.length > 0 || group.label.toLowerCase().includes(lower),
      );
  }, [groups, query]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      linkRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      linkRefs.current[index - 1]?.focus();
    }
  };

  let linkIndex = 0;
  const renderLink = (
    to: string,
    label: string,
    Icon?: React.ComponentType<{ className?: string }> ,
  ) => {
    const currentIndex = linkIndex++;
    const ref = (el: HTMLAnchorElement | null) => {
      if (vertical) linkRefs.current[currentIndex] = el;
    };
    const link = (
      <NavLink
        to={to}
        ref={ref}
        onKeyDown={(e) => vertical && handleKeyDown(e, currentIndex)}
        className={({ isActive }) =>
          cn(
            "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            vertical &&
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:origin-top before:scale-y-0 before:bg-sidebar-ring before:transition-transform before:duration-300 group-hover:before:scale-y-100",
            isActive &&
              "bg-sidebar-accent text-foreground before:scale-y-100",
          )
        }
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <span>{label}</span>
      </NavLink>
    );
    return closeOnLinkClick ? <SheetClose asChild>{link}</SheetClose> : link;
  };

  if (vertical) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            className="w-full rounded-md border bg-sidebar px-7 py-1 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            placeholder="Jump to..."
            aria-label="Search navigation"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                linkRefs.current[0]?.focus();
              }
            }}
          />
        </div>
        {renderLink("/", "Dashboard", LayoutDashboard)}
        <Accordion type="single" collapsible className="w-full">
          {filteredGroups.map((group) => {
            const Icon = group.icon;
            return (
              <AccordionItem key={group.label} value={group.label}>
                <AccordionTrigger className="group flex w-full items-center gap-2 px-2 py-1 text-base font-medium text-sidebar-foreground transition-colors hover:text-foreground">
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
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
      <li>{renderLink("/", "Dashboard", LayoutDashboard)}</li>
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

