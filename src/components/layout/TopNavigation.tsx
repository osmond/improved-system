import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { dashboardRoutes } from "@/routes";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/ui/sheet";

export default function TopNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <ul className="flex flex-col gap-4">
            <li>
              <SheetClose asChild>
                <NavLink to="/" className="block px-2 py-1 text-sm">
                  Dashboard
                </NavLink>
              </SheetClose>
            </li>
            {dashboardRoutes.map((group) => {
              const Icon = group.icon;
              const firstItem = group.items[0];
              return (
                <li key={group.label}>
                  <SheetClose asChild>
                    <NavLink
                      to={firstItem?.to ?? "#"}
                      className="flex items-center gap-2 px-2 py-1 text-sm"
                    >
                      {Icon && (
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>{group.label}</span>
                    </NavLink>
                  </SheetClose>
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
                    <NavLink to={item.to} className="block px-2 py-1 text-sm">
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

