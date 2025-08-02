import React, { useMemo, useState } from "react";
import Map, { Source, Layer, Marker, Popup, MapLayerMouseEvent } from "react-map-gl/maplibre";
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
import StateVisitSummary from "./StateVisitSummary";

import useDebounce from "@/hooks/useDebounce";

import StateVisitCallout from "./StateVisitCallout";


import statesTopo from "@/lib/us-states.json";
import CITY_COORDS from "@/lib/cityCoords";
import { fipsToAbbr } from "@/lib/stateCodes";


const weatherKey = import.meta.env.VITE_WEATHER_KEY;

export default function GeoActivityExplorer() {
  const data = useStateVisits();
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activity, setActivity] = useState("all");
  const [range, setRange] = useState("year");

  const [showWeather, setShowWeather] = useState(false);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);


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

  const filteredStates = useMemo(() => {
    if (!debouncedQuery) return states
    const q = debouncedQuery.toLowerCase()
    return states
      .map((s) => ({
        ...s,
        cities: s.cities.filter((c) => c.name.toLowerCase().includes(q)),
      }))
      .filter(
        (s) => s.stateCode.toLowerCase().includes(q) || s.cities.length > 0,
      )
  }, [states, debouncedQuery])
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

  const statesGeo = useMemo(() => {
    const fc = feature(
      statesTopo as any,
      (statesTopo as any).objects.states
    ) as unknown as GeoJSON.FeatureCollection

    return {
      type: "FeatureCollection",
      features: fc.features.map((f: any) => {
        const abbr = fipsToAbbr[f.id as string]
        const summary = summaryMap[abbr]
        const intensity = summary?.totalDays || 0
        const colorIndex = Math.min(10, Math.max(1, Math.ceil(intensity)))
        const color = summary
          ? `hsl(var(--chart-${colorIndex}))`
          : `hsl(var(--muted))`
        return { ...f, properties: { ...f.properties, abbr, color } }
      }),
    }
  }, [summaryMap])

  const stateMarkers = useMemo(
    () =>
      (statesGeo.features as any).map((f: any) => ({
        abbr: f.properties.abbr as string,
        coords: geoCentroid(f) as [number, number],
        visited: !!summaryMap[f.properties.abbr as string],
        count: summaryMap[f.properties.abbr as string]?.totalDays || 0,
      })),
    [statesGeo, summaryMap]
  ) as Array<{ abbr: string; coords: [number, number]; visited: boolean; count: number }>

  const stateCoords = useMemo(() => {
    const m: Record<string, [number, number]> = {}
    stateMarkers.forEach((s) => {
      m[s.abbr] = s.coords
    })
    return m
  }, [stateMarkers])

  const displayedMarkers = useMemo(
    () =>
      stateMarkers.filter((m) =>
        filteredStates.some((s) => s.stateCode === m.abbr),
      ),
    [stateMarkers, filteredStates],
  )

  if (!data) {
    return <Skeleton className="h-60 w-full" />;
  }

  const toggleState = (abbr: string) => {
    setExpandedState((prev) => (prev === abbr ? null : abbr));
  };

  const selectState = (abbr: string) => {
    setSelectedState((prev) => (prev === abbr ? null : abbr))
    setExpandedState((prev) => (prev === abbr ? null : abbr))
  }

  return (
    <>
      <p className="text-sm">This is a work in progress, Andy. It's going to be so rad.</p>
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

        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={showWeather}
            onChange={() => setShowWeather(!showWeather)}
            disabled={!weatherKey}
          />
          Weather
        </label>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium" htmlFor="state-search">
            Search
          </label>
          <input
            id="state-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            className="rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
          />
        </div>

      </div>
      <StateVisitSummary />
      <div className="flex gap-12">
        <div className="relative w-80 h-60">
          <Map
            aria-label="state map"
            mapLib={maplibregl}
            mapStyle="https://demotiles.maplibre.org/style.json"
            initialViewState={{ longitude: -98, latitude: 38, zoom: 3 }}
            interactiveLayerIds={["states-fill"]}
            attributionControl={false}
            onClick={(e: MapLayerMouseEvent) => {
              const f = e.features?.[0] as any
              if (f?.properties?.abbr) selectState(f.properties.abbr)
            }}
            onMouseMove={(e: MapLayerMouseEvent) => {
              const f = e.features?.[0] as any
              if (f?.properties?.abbr) setHoveredState(f.properties.abbr)
              else setHoveredState(null)
            }}
            onMouseLeave={() => setHoveredState(null)}
            style={{ width: "100%", height: "100%" }}
          >
            <Source id="states" type="geojson" data={statesGeo as any}>
              <Layer
                id="states-fill"
                type="fill"
                paint={{
                  "fill-color": ["get", "color"],
                  "fill-outline-color": "hsl(var(--border))",
                }}
              />
            </Source>
            {showWeather && weatherKey && (
              <Source
                id="wx"
                type="raster"
                tiles={[
                  `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${weatherKey}`,
                ]}
                tileSize={256}
              >
                <Layer id="wx-layer" type="raster" />
              </Source>
            )}
            {expandedState &&
              summaryMap[expandedState]?.cities.map((c) => {
                const coords = CITY_COORDS[c.name]
                return coords ? (
                  <Marker key={c.name} longitude={coords[0]} latitude={coords[1]}>
                    <circle
                      r={3}
                      fill="hsl(var(--primary))"
                      className="transition-transform motion-reduce:transition-none hover:scale-125"
                    />
                  </Marker>
                ) : null
              })}
            {displayedMarkers.map(
              (m: {
                abbr: string
                coords: [number, number]
                visited: boolean
                count: number
              }) => (
                <Marker key={m.abbr} longitude={m.coords[0]} latitude={m.coords[1]}>
                  <button
                    onClick={() => selectState(m.abbr)}
                    aria-label={`${m.abbr} ${m.visited ? "visited" : "not visited"}`}
                    className="bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Badge>{m.count}</Badge>
                  </button>
                </Marker>
              )
            )}
            {hoveredState && stateCoords[hoveredState] && (
              <Popup
                longitude={stateCoords[hoveredState][0]}
                latitude={stateCoords[hoveredState][1]}
                closeButton={false}
                closeOnClick={false}
                anchor="top"
              >
                <span className="flex gap-2 text-xs">
                  <Badge>{summaryMap[hoveredState]?.totalDays ?? 0}d</Badge>
                  <Badge>{summaryMap[hoveredState]?.totalMiles ?? 0}mi</Badge>
                </span>
              </Popup>
            )}
            {selectedState && stateCoords[selectedState] && (
              <Popup
                longitude={stateCoords[selectedState][0]}
                latitude={stateCoords[selectedState][1]}
                closeButton={false}
                closeOnClick={false}
                anchor="bottom"
              >
                <div className="flex flex-col gap-1 text-xs">
                  <span className="flex gap-2">
                    <Badge>{summaryMap[selectedState].totalDays}d</Badge>
                    <Badge>{summaryMap[selectedState].totalMiles}mi</Badge>
                  </span>
                  <button onClick={() => setSelectedState(null)}>Close</button>
                </div>
              </Popup>
            )}
          </Map>
          <ChartLegend
            payload={legendPayload}
            content={<ChartLegendContent nameKey="value" hideIcon />}
          />
          <StateVisitCallout />
        </div>

        <div className="flex-1">
          <Accordion value={expandedState || undefined} onValueChange={setExpandedState}>
            {filteredStates.map((s) => (
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
    </>
  );
}

