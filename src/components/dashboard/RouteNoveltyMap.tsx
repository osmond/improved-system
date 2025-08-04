import { useEffect, useMemo, useRef, useState } from "react";
import type { RouteRun } from "@/lib/api";
import Map, {
  Layer,
  Source,
  Popup,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Area,
  ReferenceLine,
  ReferenceArea,
} from "@/ui/chart";
import ChartCard from "./ChartCard";
import { Alert } from "@/ui/alert";
import useRouteNovelty from "@/hooks/useRouteNovelty";
import RouteNoveltyLegend from "./RouteNoveltyLegend";
import { Card } from "@/ui/card";

export default function RouteNoveltyMap() {
  const [runs, trend, prolongedLow] = useRouteNovelty();

  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [popupLocation, setPopupLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  // Animate the selected run using feature-state
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let frame: number;
    if (selectedRunId != null) {
      const animate = () => {
        const pulse = (Math.sin(performance.now() / 300) + 1) / 2;
        map.setFeatureState({ source: "routes", id: selectedRunId }, { pulse });
        frame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (selectedRunId != null) {
        map.setFeatureState({ source: "routes", id: selectedRunId }, { pulse: 0 });
      }
    };
  }, [selectedRunId]);

  const routeFeatures = useMemo(
    () => ({
      type: "FeatureCollection",
      features: runs.map((r) => ({
        type: "Feature",
        id: r.id,
        geometry: {
          type: "LineString",
          coordinates: r.points.map((p) => [p.lon, p.lat]),
        },
        properties: { novelty: r.novelty },
      })),
    }),
    [runs],
  );

  const pointFeatures = useMemo(
    () => ({
      type: "FeatureCollection",
      features: runs.map((r) => ({
        type: "Feature",
        id: r.id,
        geometry: {
          type: "Point",
          coordinates: [r.points[0].lon, r.points[0].lat],
        },
        properties: { novelty: r.novelty },
      })),
    }),
    [runs],
  );

  const showSuggestion = prolongedLow;

  const selectedRun = useMemo<RouteRun | null>(
    () =>
      selectedRunId != null
        ? runs.find((r) => r.id === selectedRunId) ?? null
        : null,
    [runs, selectedRunId],
  );

  const WINDOW_DAYS = 7;
  const THRESHOLD = 0.3;
  const lowSpan = useMemo(() => {
    if (!prolongedLow || trend.length < WINDOW_DAYS) return null;
    return {
      start: trend[trend.length - WINDOW_DAYS].date,
      end: trend[trend.length - 1].date,
    };
  }, [prolongedLow, trend]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }),
    [],
  );

  const handleClick = (e: MapLayerMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["route-lines"],
    });
    const feature = features[0];
    if (feature && feature.id != null) {
      setSelectedRunId(feature.id as number);
      setPopupLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    } else {
      setSelectedRunId(null);
      setPopupLocation(null);
    }
  };

  return (
    <ChartCard title="Route Novelty" description="Explore how unique your routes are">
      <div className="relative h-64 mb-4">
        <Map
          mapLib={maplibregl}
          ref={mapRef}
          initialViewState={{ latitude: 43.079, longitude: -89.4, zoom: 11 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          onClick={handleClick}
        >
          <Source id="routes" type="geojson" data={routeFeatures}>
            <Layer
              id="route-lines"
              type="line"
              paint={{
                "line-gradient": [
                  "interpolate",
                  ["linear"],
                  ["line-progress"],
                  0,
                  [
                    "case",
                    ["==", ["id"], selectedRunId ?? -1],
                    "#00f",
                    [
                      "interpolate",
                      ["linear"],
                      ["get", "novelty"],
                      0,
                      "#888",
                      1,
                      "#f00",
                    ],
                  ],
                  1,
                  [
                    "case",
                    ["==", ["id"], selectedRunId ?? -1],
                    "#0000ff00",
                    [
                      "interpolate",
                      ["linear"],
                      ["get", "novelty"],
                      0,
                      "#88888800",
                      1,
                      "#ff000000",
                    ],
                  ],
                ],
                "line-width": [
                  "case",
                  ["==", ["id"], selectedRunId ?? -1],
                  [
                    "+",
                    5,
                    ["*", 2, ["coalesce", ["feature-state", "pulse"], 0]],
                  ],
                  3,
                ],
              }}
            />
            <Layer
              id="route-arrows"
              type="symbol"
              layout={{
                "symbol-placement": "line",
                "symbol-spacing": 50,
                "icon-image": "triangle-15",
                "icon-size": 0.5,
              }}
              paint={{
                "icon-color": [
                  "case",
                  ["==", ["id"], selectedRunId ?? -1],
                  "#00f",
                  [
                    "interpolate",
                    ["linear"],
                    ["get", "novelty"],
                    0,
                    "#888",
                    1,
                    "#f00",
                  ],
                ],
              }}
            />
          </Source>
          <Source
            id="novelty-points"
            type="geojson"
            data={pointFeatures}
            cluster
            clusterRadius={40}
          >
            <Layer
              id="clusters"
              type="circle"
              filter={["has", "point_count"]}
              paint={{
                "circle-color": "#999",
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  15,
                  5,
                  20,
                  10,
                  25,
                ],
              }}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              filter={["has", "point_count"]}
              layout={{
                "text-field": "{point_count_abbreviated}",
                "text-size": 12,
              }}
            />
            <Layer
              id="novelty-text"
              type="symbol"
              filter={["!", ["has", "point_count"]]}
              layout={{
                "text-field": ["to-string", ["get", "novelty"]],
                "text-size": 12,
                "text-offset": [0, 1.2],
              }}
            />
          </Source>
          {selectedRun && popupLocation && (
            <Popup
              longitude={popupLocation.lng}
              latitude={popupLocation.lat}
              onClose={() => {
                setSelectedRunId(null);
                setPopupLocation(null);
              }}
            >
              <Card className="p-2 space-y-1">
                <div className="font-medium">{selectedRun.name}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(selectedRun.timestamp).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  Novelty: {numberFormatter.format(selectedRun.novelty)}
                </div>
                <div className="text-sm">
                  DTW similarity: {numberFormatter.format(selectedRun.dtwSimilarity)}
                </div>
                <div className="text-sm">
                  Overlap similarity: {numberFormatter.format(
                    selectedRun.overlapSimilarity,
                  )}
                </div>
              </Card>
            </Popup>
          )}
          <NavigationControl position="top-left" />
          <ScaleControl position="bottom-left" />
        </Map>
        <div className="absolute top-2 right-2 z-10">
          <RouteNoveltyLegend />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Routes are colored by novelty—gray for familiar paths, red for unique ones.
        Clustered labels show novelty at starting points.
      </p>
      <div className="h-40">
        <ChartContainer
          config={{ value: { label: "Novelty", color: "hsl(var(--chart-1))" } }}
        >
          <LineChart data={trend} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="novelty-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 1]} hide />
            <ChartTooltip />
            {lowSpan && (
              <ReferenceArea
                x1={lowSpan.start}
                x2={lowSpan.end}
                stroke={false}
                fill="var(--color-value)"
                fillOpacity={0.1}
              />
            )}
            <ReferenceLine
              y={THRESHOLD}
              stroke="var(--muted-foreground)"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#novelty-gradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
      {showSuggestion && (
        <Alert className="mt-4">
          Your recent routes look familiar. Consider exploring new paths to keep things
          novel.
        </Alert>
      )}
    </ChartCard>
  );
}

