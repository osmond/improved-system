import React, { useMemo, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { feature } from "topojson-client";
import { geoCentroid } from "d3-geo";
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
import statesTopo from "../../../public/us-states.json";
import CITY_COORDS from "@/lib/cityCoords";
import { fipsToAbbr } from "@/lib/stateCodes";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface StateFeature extends GeoJSON.Feature<GeoJSON.Geometry> {
  properties: { [k: string]: any } & { abbr: string; color: string };
}

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

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
    const cfg: Record<string, { label: string; color: string }> = {};
    for (let i = 1; i <= 10; i++) {
      cfg[i] = { label: String(i), color: `hsl(var(--chart-${i}))` };
    }
    return cfg;
  }, []);

  const legendPayload = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        color: `hsl(var(--chart-${i + 1}))`,
      })),
    []
  );

  const statesGeo = useMemo(() => {
    const geo = feature(statesTopo as any, (statesTopo as any).objects.states) as GeoJSON.FeatureCollection;
    return geo.features as StateFeature[];
  }, []);

  const mapData = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: statesGeo.map((f) => {
        const abbr = fipsToAbbr[f.id as string];
        const summary = summaryMap[abbr];
        const intensity = summary?.totalDays || 0;
        const colorIndex = Math.min(10, Math.max(1, Math.ceil(intensity)));
        const color = summary?.visited
          ? `hsl(var(--chart-${colorIndex}))`
          : `hsl(var(--muted))`;
        return {
          ...f,
          properties: { ...(f.properties || {}), abbr, color },
        } as StateFeature;
      }),
    } as GeoJSON.FeatureCollection;
  }, [statesGeo, summaryMap]);

  if (!data) {
    return <Skeleton className="h-60 w-full" />;
  }

  const toggleState = (abbr: string) => {
    setExpandedState((prev) => (prev === abbr ? null : abbr));
  };

  const layers: Layer[] = [
    {
      id: "states-fill",
      type: "fill",
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": ["case", ["==", ["get", "abbr"], expandedState], 0.7, 1],
      },
    },
    {
      id: "states-outline",
      type: "line",
      paint: {
        "line-color": "#000",
        "line-width": ["case", ["==", ["get", "abbr"], expandedState], 1, 0],
      },
    },
  ];

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
            <Map
              mapLib={maplibregl}
              initialViewState={{ longitude: -98, latitude: 38, zoom: 3 }}
              style={{ width: "100%", height: "100%" }}
              mapStyle={MAP_STYLE}
              interactiveLayerIds={["states-fill"]}
              onClick={(e) => {
                const feature = e.features?.[0] as any;
                if (feature) toggleState(feature.properties.abbr);
              }}
            >
              <Source id="states" type="geojson" data={mapData}>
                {layers.map((l) => (
                  <Layer key={l.id} {...l} />
                ))}
              </Source>
              {mapData.features.map((f) => {
                const summary = summaryMap[f.properties.abbr];
                if (!summary?.visited) return null;
                const [lng, lat] = geoCentroid(f as any);
                return (
                  <Tooltip key={f.properties.abbr}>
                    <TooltipTrigger asChild>
                      <Marker
                        longitude={lng}
                        latitude={lat}
                        anchor="center"
                        style={{ cursor: "pointer", background: "transparent" }}
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ background: f.properties.color, opacity: 0 }}
                          aria-label={`${f.properties.abbr} visited`}
                          onClick={() => toggleState(f.properties.abbr)}
                        />
                      </Marker>
                    </TooltipTrigger>
                    <TooltipContent>{`${f.properties.abbr}: ${summary.totalDays}d ${summary.totalMiles}mi`}</TooltipContent>
                  </Tooltip>
                );
              })}
              {expandedState &&
                summaryMap[expandedState]?.cities.map((c) => {
                  const coords = CITY_COORDS[c.name];
                  return coords ? (
                    <Marker
                      key={c.name}
                      longitude={coords[0]}
                      latitude={coords[1]}
                      anchor="center"
                    >
                      <circle
                        r={3}
                        fill="hsl(var(--primary))"
                        className="transition-transform motion-reduce:transition-none hover:scale-125"
                      />
                    </Marker>
                  ) : null;
                })}
            </Map>
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
