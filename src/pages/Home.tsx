import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes } from "@/routes";

export default function Home() {
  return (
    <div className="space-y-6 p-6">
      {dashboardRoutes.map((group) => (
        <div key={group.label} className="space-y-2">
          <h2 className="text-xl font-semibold">{group.label}</h2>
          <ul className="ml-4 list-disc space-y-1">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-blue-600 hover:underline">
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
