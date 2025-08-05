import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "@/routes";

export default function TopNavigation() {
  return (
    <nav>
      <ul className="flex gap-4">
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

