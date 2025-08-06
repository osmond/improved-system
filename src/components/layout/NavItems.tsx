import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  className?: string;
  onNavigate?: () => void;
}

export default function NavItems({ className, onNavigate }: NavItemsProps) {
  return (
    <ul className={cn(className)}>
      <li>
        <NavLink
          to="/"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              linkBase,
              isActive && linkActive
            )
          }
        >
          <span className="transition-colors group-hover:text-primary">Dashboard</span>
        </NavLink>
      </li>
      {dashboardRoutes.map((group) => {
        const Icon = group.icon;
        const firstItem = group.items[0];
        return (
          <li key={group.label} className="relative group">
            <NavLink
              to={firstItem?.to ?? "#"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(linkBase, isActive && linkActive)
              }
            >
              {Icon && (
                <Icon
                  className="h-4 w-4 transition-transform group-hover:scale-105"
                  aria-hidden="true"
                />
              )}
              <span className="transition-colors group-hover:text-primary">
                {group.label}
              </span>
            </NavLink>
            <ul className="absolute z-10 hidden w-48 flex-col gap-2 bg-white p-4 shadow-md group-hover:flex">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "block px-2 py-1 text-sm transition-colors hover:text-primary",
                        isActive && "active text-primary"
                      )
                    }
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
  );
}

const linkBase =
  "group relative flex items-center gap-2 px-2 py-1 text-sm transition-colors hover:text-primary after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100";

const linkActive = "active text-primary after:scale-x-100";
