import React from "react";
import { FragilityGauge } from "@/components/dashboard";

export default function FragilityPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Fragility Index</h1>
      <p className="text-sm text-muted-foreground">
        The fragility index blends training consistency with load spikes to
        estimate injury risk. Lower scores signal resilience, while higher
        scores call for caution.
      </p>
      <ul className="text-sm text-muted-foreground list-disc pl-4">
        <li><span className="text-green-600">0–0.33</span>: stable</li>
        <li><span className="text-yellow-600">0.34–0.66</span>: monitor</li>
        <li><span className="text-red-600">0.67–1.00</span>: high risk</li>
      </ul>
      <FragilityGauge />
    </div>
  );
}
