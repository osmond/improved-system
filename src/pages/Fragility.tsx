import React from "react";
import { FragilityIndexCard } from "@/components/dashboard";
import { FRAGILITY_LEVELS } from "@/lib/fragility";

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
        {Object.values(FRAGILITY_LEVELS).map((level) => (
          <li key={level.key}>
            <span className={level.textClass}>
              {level.displayMin.toFixed(2).replace(/\.00$/, '')}–{level.displayMax.toFixed(2)}
            </span>: {level.description}
          </li>
        ))}
      </ul>
      <FragilityIndexCard />
    </div>
  );
}
