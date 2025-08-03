import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { BehavioralWeatherWidget } from "@/components/dashboard";

export default function DashboardLanding() {
    return (
      <div className="space-y-6 p-6">
        <BehavioralWeatherWidget />
        {dashboardRoutes.map((group) => (
          <div key={group.label} className="space-y-2">
            <h2 className="text-lg font-semibold">{group.label}</h2>
            <ul className="space-y-1">
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
