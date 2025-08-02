import { useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Source,
  Popup,
  MapLayerMouseEvent,
  MapRef,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import { Alert } from "@/components/ui/alert";
import useRouteNovelty from "@/hooks/useRouteNovelty";
import type { RouteRun } from "@/lib/api";

export default function RouteNoveltyMap() {
  const [runs, trend, prolongedLow] = useRouteNovelty();

  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [popupLocation, setPopupLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const mapRef = useRef<MapRef | null>(null);

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
      <div className="h-64 mb-4">
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
                "line-color": [
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
                "line-width": [
                  "case",

                  ["==", ["id"], selectedRunId ?? -1],

                  5,
                  3,
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
              <div>
                <div>{selectedRun.name}</div>
                <div>{selectedRun.timestamp.slice(0, 10)}</div>
                <div>Novelty: {selectedRun.novelty}</div>
              </div>
            </Popup>
          )}
        </Map>
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
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 1]} hide />
            <ChartTooltip />
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

