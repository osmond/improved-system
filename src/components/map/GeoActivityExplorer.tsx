import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useStateVisits } from "@/hooks/useStateVisits";
import type { StateVisit } from "@/lib/types";
import { fipsToAbbr } from "@/lib/stateCodes";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function GeoActivityExplorer() {
  const data = useStateVisits();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!data) return <Skeleton className="h-60 w-full" />;

  const selected = expanded
    ? data.find((d) => d.stateCode === expanded) || null
    : null;

  return (
    <ChartContainer config={{}} title="State Visits" className="space-y-4">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-60"
        data-testid="state-map"
      >
        <Geographies geography="/us-states.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const abbr = fipsToAbbr[geo.id as string]
              if (!abbr) return null
              const state = data.find((d) => d.stateCode === abbr)
              const visited = state?.visited
              const selectedState = expanded === abbr
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  data-state={abbr}
                  onClick={() =>
                    setExpanded(selectedState ? null : abbr)
                  }
                  style={{
                    default: {
                      fill: visited
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                      stroke: selectedState
                        ? "hsl(var(--ring))"
                        : "hsl(var(--border))",
                      strokeWidth: selectedState ? 2 : 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: visited
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                      stroke: "hsl(var(--ring))",
                      strokeWidth: 2,
                      outline: "none",
                    },
                    pressed: {
                      fill: visited
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                      stroke: "hsl(var(--ring))",
                      strokeWidth: 2,
                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="grid grid-cols-5 gap-2">
        {data.map((state) => (
          <button
            key={state.stateCode}
            aria-pressed={expanded === state.stateCode}
            onClick={() =>
              setExpanded(expanded === state.stateCode ? null : state.stateCode)
            }
            className={cn(
              "h-12 flex items-center justify-center rounded border text-sm font-medium focus:outline-none focus:ring",
              state.visited
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
              expanded === state.stateCode && "ring-2 ring-ring"
            )}
          >
            {state.stateCode}
          </button>
        ))}
      </div>
      {selected && <StateDetail state={selected} />}
    </ChartContainer>
  );
}

function StateDetail({ state }: { state: StateVisit }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        {state.stateCode} &ndash; {state.totalDays} days, {state.totalMiles} miles
      </h3>
      {state.cities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No cities visited</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-1">City</th>
              <th className="py-1">Days</th>
              <th className="py-1">Miles</th>
            </tr>
          </thead>
          <tbody>
            {state.cities.map((city) => (
              <tr key={city.name} className="border-t border-border">
                <td className="py-1">{city.name}</td>
                <td className="py-1">{city.days}</td>
                <td className="py-1">{city.miles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
