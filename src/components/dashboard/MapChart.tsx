import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { StateVisit } from "@/lib/types";
import { fipsToAbbr } from "@/lib/stateCodes";

import ChartCard from "./ChartCard";

interface MapChartProps {
  data: StateVisit[];
  selectedState: string | null;
  onSelectState: (stateCode: string) => void;
}

export default function MapChart({ data, selectedState, onSelectState }: MapChartProps) {
  const visited = new Set(data.filter((d) => d.visited).map((d) => d.stateCode));

  return (
    <ChartCard title="Visited States">
      <ComposableMap projection="geoAlbersUsa" width={800} height={400}>
        <Geographies geography="/us-states.json">
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
            const code = fipsToAbbr[geo.id as string];
            const isVisited = code ? visited.has(code) : false;
            const isSelected = code === selectedState;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => isVisited && code && onSelectState(code)}
                style={{
                  default: {
                    fill: isSelected
                      ? "hsl(var(--accent))"
                      : isVisited
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                    stroke: isSelected ? "hsl(var(--accent-foreground))" : "none",
                    outline: "none",
                  },
                  hover: {
                    fill: isVisited
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                    cursor: isVisited ? "pointer" : "not-allowed",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
      </ComposableMap>
    </ChartCard>
  );
}
