import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes } from "@/routes";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {dashboardRoutes.map((group) => (
        <div key={group.label} className="space-y-2">
          <h2 className="text-lg font-semibold">{group.label}</h2>
          <ul className="list-disc pl-4 space-y-1">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link className="text-blue-600 hover:underline" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
