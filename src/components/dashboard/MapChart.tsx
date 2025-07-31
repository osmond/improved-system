import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { StateVisit } from "@/lib/types";

interface MapChartProps {
  data: StateVisit[];
  onSelectState: (stateCode: string) => void;
}

export default function MapChart({ data, onSelectState }: MapChartProps) {
  const visited = new Set(data.filter((d) => d.visited).map((d) => d.stateCode));

  return (
    <ComposableMap projection="geoAlbersUsa" width={800} height={400}>
      <Geographies geography="/us-states.json">
        {({ geographies }) =>
          geographies.map((geo) => {
            const code = geo.properties.iso_3166_2.split("-")[1];
            const isVisited = visited.has(code);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => isVisited && onSelectState(code)}
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
  );
}
