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

const FIPS_TO_ABBR: Record<string, string> = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
};

const CITY_COORDS: Record<string, [number, number]> = {
  "Los Angeles": [-118.2437, 34.0522],
  "San Francisco": [-122.4194, 37.7749],
  "San Diego": [-117.1611, 32.7157],
  Austin: [-97.7431, 30.2672],
  Houston: [-95.3698, 29.7604],
};

export default function GeoActivityExplorer() {
  const data = useStateVisits();
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [activity, setActivity] = useState("all");
  const [range, setRange] = useState("year");

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
                {({ geographies }) =>
                  geographies.map((geo) => {
                  const abbr = FIPS_TO_ABBR[geo.id as string];
                  const visited = summaryMap[abbr]?.visited;
                  const intensity = summaryMap[abbr]?.totalDays || 0;
                  const colorIndex = Math.min(10, Math.max(1, Math.ceil(intensity)));
                  const fill = visited
                    ? `hsl(var(--chart-${colorIndex}))`
                    : `hsl(var(--muted))`;
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") toggleState(abbr);
                            }}
                            onClick={() => toggleState(abbr)}
                            aria-label={abbr + (visited ? " visited" : " not visited")}
                            style={{
                              default: {
                                fill,
                                outline: "none",
                                transition: "fill 0.2s, transform 0.2s",
                                stroke: abbr === expandedState ? "black" : undefined,
                                strokeWidth: abbr === expandedState ? 1 : undefined,
                              },
                              hover: { fill, outline: "none", transform: "scale(1.03)" },
                              pressed: { fill, outline: "none" },
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
                        <circle r={3} fill="hsl(var(--primary))" />
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
    </ChartContainer>
  );
}

