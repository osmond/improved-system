import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { dashboardRoutes } from "@/routes";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";

export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  return (
    <nav className="flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="md:hidden p-2"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <ul className="flex flex-col gap-4">
            <li>
              <NavLink
                to="/"
                className="block px-2 py-1 text-sm"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
            {dashboardRoutes.map((group) => {
              const firstItem = group.items[0];
              return (
                <li key={group.label}>
                  <NavLink
                    to={firstItem?.to ?? "#"}
                    className="block px-2 py-1 text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {group.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
      <ul className="hidden md:flex gap-4">
        <li>
          <NavLink to="/" className="block px-2 py-1 text-sm">
            Dashboard
          </NavLink>
        </li>
        {dashboardRoutes.map((group) => {
          const Icon = group.icon;
          const firstItem = group.items[0];
          return (
            <li key={group.label} className="relative group">
              <NavLink
                to={firstItem?.to ?? "#"}
                className="flex items-center gap-2 px-2 py-1 text-sm"
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                <span>{group.label}</span>
              </NavLink>
              <ul className="absolute z-10 hidden w-48 flex-col gap-2 bg-white p-4 shadow-md group-hover:flex">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className="block px-2 py-1 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

