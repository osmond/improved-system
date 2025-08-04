import React, { useMemo, useState, useRef } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  MapLayerMouseEvent,
  MapRef,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { feature } from "topojson-client";
import { geoCentroid, geoBounds } from "d3-geo";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import { useStateVisits } from "@/hooks/useStateVisits";
import type { StateVisit } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleSelect } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StateVisitSummary from "./StateVisitSummary";
import StateCityBreakdown from "./StateCityBreakdown";

import useDebounce from "@/hooks/useDebounce";

import StateVisitCallout from "./StateVisitCallout";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";


import statesTopo from "@/lib/us-states.json";
import CITY_COORDS from "@/lib/cityCoords";
import { fipsToAbbr } from "@/lib/stateCodes";
import { formatDate, formatMiles } from "@/lib/format";
import { Bike, Footprints } from "lucide-react";

// OpenWeatherMap API key for precipitation tiles. This key is specific to the
// app and can be replaced by setting VITE_WEATHER_KEY if needed.
const weatherKey =
  import.meta.env.VITE_WEATHER_KEY || "37744b6f778e02303a56b9cf3c6da8e0";

export default function GeoActivityExplorer() {
  const { data, loading, error, refetch } = useStateVisits();
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activity, setActivity] = useState("all");
  const [range, setRange] = useState("year");

  const [showWeather, setShowWeather] = useState(false);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const mapRef = useRef<MapRef | null>(null);

  const prefersReducedMotion = useReducedMotion();


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
  const maxDays = useMemo(
    () => Math.max(...states.map((s) => s.totalDays), 0),
    [states],
  )
  const colorScale = useMemo(
    () => scaleSequential(interpolateBlues).domain([0, maxDays || 1]),
    [maxDays],
  )
  const legendGradient = useMemo(
    () => `linear-gradient(to right, ${colorScale(0)}, ${colorScale(maxDays)})`,
    [colorScale, maxDays],
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
        const color = summary ? colorScale(intensity) : `hsl(var(--muted))`
        return { ...f, properties: { ...f.properties, abbr, color } }
      }),
    }
  }, [summaryMap, colorScale])

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

  if (loading) {
    return <Skeleton className="h-60 w-full" />;
  }

  if (error) {
    return (
      <div className="flex h-60 w-full flex-col items-center justify-center text-sm">
        <p>Failed to load state visits.</p>
        <button className="underline" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const toggleState = (abbr: string) => {
    setExpandedState((prev) => (prev === abbr ? null : abbr));
  };

  const selectState = (abbr: string) => {
    setSelectedState((prev) => {
      const next = prev === abbr ? null : abbr
      if (next) {
        const f = (statesGeo.features as any).find(
          (ft: any) => ft.properties.abbr === next,
        )
        if (f) {
          const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(f as any)
          mapRef.current?.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 20 },
          )
        }
      }
      return next
    })
    setExpandedState((prev) => (prev === abbr ? null : abbr))
  }

  const selectedDetails = useMemo(() => {
    if (!selectedState) return null
    const s = summaryMap[selectedState]
    if (!s) return null
    const last = [...s.log].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0]
    const mostCity = s.cities.reduce(
      (prev, curr) => (curr.days > prev.days ? curr : prev),
      s.cities[0] || null,
    )
    const runMiles = s.log
      .filter((l) => l.type === "run")
      .reduce((acc, l) => acc + l.miles, 0)
    const bikeMiles = s.log
      .filter((l) => l.type === "bike")
      .reduce((acc, l) => acc + l.miles, 0)
    return {
      lastDate: last?.date,
      mostCity: mostCity?.name,
      runMiles,
      bikeMiles,
    }
  }, [selectedState, summaryMap])

  return (
    <>
      <p className="text-sm">This is a work in progress, Andy. It's going to be so rad.</p>
      <div className="flex flex-col text-xs rounded-md bg-card p-4 h-60 md:h-80 lg:h-96 space-y-6">
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
            ref={mapRef}
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
                {...(!prefersReducedMotion
                  ? ({ "fill-color-transition": { duration: 300 } } as any)
                  : {})}
              />
              {selectedState && (
                <Layer
                  id="states-highlight"
                  type="line"
                  filter={["==", ["get", "abbr"], selectedState] as any}
                  paint={{
                    "line-color": "hsl(var(--primary))",
                    "line-width": 3,
                  }}
                />
              )}
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
            <AnimatePresence>
              {expandedState &&
                summaryMap[expandedState]?.cities.map((c) => {
                  const coords = CITY_COORDS[c.name]
                  return coords ? (
                    <Marker key={c.name} longitude={coords[0]} latitude={coords[1]}>
                      <motion.circle
                        r={3}
                        fill="hsl(var(--primary))"
                        className="motion-safe:transition-transform motion-safe:hover:scale-125 motion-reduce:transition-none motion-reduce:hover:scale-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Marker>
                  ) : null
                })}
            </AnimatePresence>
            {displayedMarkers.map(
              (m: {
                abbr: string
                coords: [number, number]
                visited: boolean
                count: number
              }) => (
                <Marker key={m.abbr} longitude={m.coords[0]} latitude={m.coords[1]}>
                  <motion.button
                    onClick={() => selectState(m.abbr)}
                    aria-label={`${m.abbr} ${m.visited ? "visited" : "not visited"}`}
                    className="bg-transparent border-none p-0 cursor-pointer motion-safe:transition motion-safe:ease-out motion-safe:hover:scale-110 motion-safe:hover:opacity-80 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:opacity-100"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: selectedState === m.abbr ? 1.2 : 1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
                  >
                    <Badge>{m.count}</Badge>
                  </motion.button>
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
                    <Badge>{formatMiles(summaryMap[selectedState].totalMiles)}</Badge>
                  </span>
                  {selectedDetails?.lastDate && (
                    <span>Last: {formatDate(selectedDetails.lastDate)}</span>
                  )}
                  {selectedDetails?.mostCity && (
                    <span>Top city: {selectedDetails.mostCity}</span>
                  )}
                  <span className="flex gap-1">
                    {selectedDetails?.runMiles ? (
                      <Badge className="flex items-center gap-1">
                        <Footprints className="h-3 w-3" />
                        {formatMiles(selectedDetails.runMiles)}
                      </Badge>
                    ) : null}
                    {selectedDetails?.bikeMiles ? (
                      <Badge className="flex items-center gap-1">
                        <Bike className="h-3 w-3" />
                        {formatMiles(selectedDetails.bikeMiles)}
                      </Badge>
                    ) : null}
                  </span>
                  <button onClick={() => setSelectedState(null)}>Close</button>
                </div>
              </Popup>
            )}
          </Map>
          <div className="flex items-center justify-center gap-2 pt-3">
            <span className="text-muted-foreground">0</span>
            <div className="h-2 w-24 rounded-sm" style={{ background: legendGradient }} />
            <span className="text-muted-foreground">{maxDays}</span>
          </div>
          <StateVisitCallout onSelectState={selectState} />
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            {filteredStates.map((s) => (
              <details
                key={s.stateCode}
                open={expandedState === s.stateCode}
                onToggle={(e) =>
                  setExpandedState(e.currentTarget.open ? s.stateCode : null)
                }
              >
                <summary className="flex justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-medium">{s.stateCode}</span>
                    <Badge>{s.cities.length}</Badge>
                  </span>
                  <span className="flex gap-2">
                    <Badge>{s.totalDays}d</Badge>
                    <Badge>{s.totalMiles}mi</Badge>
                  </span>
                </summary>
                <StateCityBreakdown cities={s.cities} />
              </details>
            ))}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

