import React, { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useStateVisits } from "@/hooks/useStateVisits";
import type { StateVisit } from "@/lib/types";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SimpleSelect } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import statesTopo from "../../../public/us-states.json";
import CITY_COORDS from "@/lib/cityCoords";
import { fipsToAbbr } from "@/lib/stateCodes";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";


export default function GeoActivityExplorer() {
  const data = useStateVisits();
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [activity, setActivity] = useState("all");
  const [range, setRange] = useState("year");
  const prefersReducedMotion = usePrefersReducedMotion();

  const now = new Date();
  const inRange = (d: string) => {
    const date = new Date(d);
    if (range === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (range === "year") {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const states = useMemo(() => {
    return (data || [])
      .map((s) => {
        const logs = s.log.filter(
          (l) => (activity === "all" || l.type === activity) && inRange(l.date)
        );
        return {
          ...s,
          visited: logs.length > 0,
          totalDays: logs.length,
          totalMiles: logs.reduce((acc, l) => acc + l.miles, 0),
        };
      })
      .filter((s) => s.visited);
  }, [data, activity, range]);

  const summaryMap = useMemo(() => {
    const m: Record<string, StateVisit> = {};
    states.forEach((s) => {
      m[s.stateCode] = s;
    });
    return m;
  }, [states]);
  const legendConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    for (let i = 1; i <= 10; i++) {
      cfg[i] = { label: String(i), color: `hsl(var(--chart-${i}))` }
    }
    return cfg
  }, [])

  const legendPayload = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        color: `hsl(var(--chart-${i + 1}))`,
      })),
    []
  )

  if (!data) {
    return <Skeleton className="h-60 w-full" />;
  }

  const toggleState = (abbr: string) => {
    setExpandedState((prev) => (prev === abbr ? null : abbr));
  };

  return (
    <ChartContainer
      config={legendConfig}
      title="State Visits"
      className="h-60 space-y-6"
    >
      <>
      <div className="flex gap-4 mb-4">
        <SimpleSelect
          label="Activity"
          value={activity}
          onValueChange={setActivity}
          options={[
            { value: "all", label: "All" },
            { value: "run", label: "Run" },
            { value: "bike", label: "Bike" },
          ]}
        />
        <SimpleSelect
          label="Range"
          value={range}
          onValueChange={setRange}
          options={[
            { value: "year", label: "This Year" },
            { value: "month", label: "This Month" },
            { value: "all", label: "All Time" },
          ]}
        />
      </div>
      <div className="flex gap-12">
        <div className="w-80 h-60">
          <TooltipProvider delayDuration={100}>
            <ComposableMap projection="geoAlbersUsa">
              <Geographies geography={statesTopo as any}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                  const abbr = fipsToAbbr[geo.id as string];
                  const visited = summaryMap[abbr]?.visited;
                  const intensity = summaryMap[abbr]?.totalDays || 0;
                  const colorIndex = Math.min(10, Math.max(1, Math.ceil(intensity)));
                  const baseFill = visited
                    ? `hsl(var(--chart-${colorIndex}))`
                    : `hsl(var(--muted))`;
                  const expanded = abbr === expandedState;
                  const fill = expanded
                    ? `${baseFill.replace(')', ' / 0.7)')}`
                    : baseFill;
                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                            geography={geo}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e: React.KeyboardEvent<SVGPathElement>) => {
                              if (e.key === "Enter" || e.key === " ") toggleState(abbr);
                            }}
                            onClick={() => toggleState(abbr)}
                            aria-label={abbr + (visited ? " visited" : " not visited")}
                            style={{
                              default: {
                                fill,
                                outline: "none",
                                transition: prefersReducedMotion
                                  ? undefined
                                  : "fill 0.3s, transform 0.3s",
                                stroke: expanded ? "black" : undefined,
                                strokeWidth: expanded ? 1 : undefined,
                                transform: expanded ? "scale(1.05)" : undefined,
                              },
                              hover: {
                                fill: baseFill,
                                outline: "none",
                                transform: prefersReducedMotion
                                  ? undefined
                                  : "scale(1.03)",
                              },
                              pressed: { fill: baseFill, outline: "none" },
                            }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{`${abbr}: ${intensity}d ${summaryMap[abbr]?.totalMiles || 0}mi`}</TooltipContent>
                    </Tooltip>
                  );
                })
                }
              </Geographies>
                {expandedState &&
                  summaryMap[expandedState]?.cities.map((c) => {
                    const coords = CITY_COORDS[c.name]
                    return coords ? (
                      <Marker key={c.name} coordinates={coords}>
                        <circle
                          r={3}
                          fill="hsl(var(--primary))"
                          className="transition-transform motion-reduce:transition-none hover:scale-125"
                        />
                      </Marker>
                    ) : null
                  })}
              </ComposableMap>
          </TooltipProvider>
          <ChartLegend
            payload={legendPayload}
            content={<ChartLegendContent nameKey="value" hideIcon />}
          />
        </div>

        <div className="flex-1">
          <Accordion value={expandedState || undefined} onValueChange={setExpandedState}>
            {states.map((s) => (
              <AccordionItem key={s.stateCode} value={s.stateCode}>
                <AccordionTrigger className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-medium">{s.stateCode}</span>
                    <Badge>{s.cities.length}</Badge>
                  </span>
                  <span className="flex gap-2">
                    <Badge>{s.totalDays}d</Badge>
                    <Badge>{s.totalMiles}mi</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="text-sm space-y-1">
                    {s.cities.map((c) => (
                      <li key={c.name} className="flex justify-between px-2">
                        <span>{c.name}</span>
                        <span className="flex gap-2">
                          <Badge>{c.days}d</Badge>
                          <Badge>{c.miles}mi</Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      </>
    </ChartContainer>
  );
}

