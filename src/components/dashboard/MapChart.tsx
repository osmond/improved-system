import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { StateVisit } from "@/lib/types";
import { fipsToAbbr } from "@/lib/stateCodes";
import { ChartContainer } from "@/components/ui/chart-container";

interface MapChartProps {
  data: StateVisit[];
  onSelectState: (stateCode: string) => void;
}

export default function MapChart({ data, onSelectState }: MapChartProps) {
  const visited = new Set(data.filter((d) => d.visited).map((d) => d.stateCode));

  return (
    <ChartContainer
      title="Visited States"
      className="md:col-span-2"
      aria-label="Map of visited states"
    >
      <ComposableMap projection="geoAlbersUsa" width={800} height={400}>
        <Geographies geography="/us-states.json">
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
            const code = fipsToAbbr[geo.id as string];
            const isVisited = code ? visited.has(code) : false;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => isVisited && code && onSelectState(code)}
                style={{
                  default: {
                    fill: isVisited ? "hsl(var(--primary))" : "hsl(var(--muted))",
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
    </ChartContainer>
  );
}
