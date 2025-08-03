import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { BehavioralWeatherWidget, DeltaSpotlightTiles } from "@/components/dashboard";
import useTopMetricChanges from "@/hooks/useTopMetricChanges";

export default function DashboardLanding() {
    const topChanges = useTopMetricChanges();
    return (
      <div className="space-y-6 p-6">
        <BehavioralWeatherWidget />
        <DeltaSpotlightTiles metrics={topChanges} />
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
