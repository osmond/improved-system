import { useEffect, useMemo, useRef, useState } from "react";
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
import { calculateRouteSimilarity, getMockRoutes, Route } from "@/lib/api";

interface Run extends Route {
  id: number;
  date: string;
  novelty: number;
}

export default function RouteNoveltyMap() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [trend, setTrend] = useState<Array<{ index: number; novelty: number }>>([]);

  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [popupLocation, setPopupLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const mapRef = useRef<MapRef | null>(null);


  useEffect(() => {
    getMockRoutes().then((baseRoutes) => {
      const generated: Run[] = Array.from({ length: 10 }, (_, i) => {
        const base = baseRoutes[i % baseRoutes.length];
        const points = base.points.map((p) => ({
          lat: p.lat + (Math.random() - 0.5) * 0.01,
          lon: p.lon + (Math.random() - 0.5) * 0.01,
        }));
        const d = new Date();
        d.setDate(d.getDate() - (10 - i));
        return {
          id: i + 1,
          name: base.name,
          points,
          date: d.toISOString().slice(0, 10),
          novelty: 0,
        };
      });
      const withNovelty = generated.map((run, i) => {
        if (i === 0) return { ...run, novelty: 1 };
        const sim = calculateRouteSimilarity(run.points, generated[i - 1].points);
        return { ...run, novelty: +(1 - sim).toFixed(2) };
      });
      setRuns(withNovelty);
      const windowSize = 5;
      const rolling = withNovelty.map((r, i) => {
        const start = Math.max(0, i - windowSize + 1);
        const slice = withNovelty.slice(start, i + 1);
        const avg = slice.reduce((acc, s) => acc + s.novelty, 0) / slice.length;
        return { index: i + 1, novelty: +avg.toFixed(2) };
      });
      setTrend(rolling);
    });
  }, []);

  const routeFeatures = useMemo(
    () => ({
      type: "FeatureCollection",
      features: runs.map((r, i) => ({
        type: "Feature",
        id: r.id,
        geometry: {
          type: "LineString",
          coordinates: r.points.map((p) => [p.lon, p.lat]),
        },
        properties: { novelty: r.novelty, index: i },
      })),
    }),
    [runs],
  );

  const pointFeatures = useMemo(
    () => ({
      type: "FeatureCollection",
      features: runs.map((r) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [r.points[0].lon, r.points[0].lat],
        },
        properties: { novelty: r.novelty },
      })),
    }),
    [runs],
  );

  const showSuggestion =
    trend.length > 0 && trend[trend.length - 1].novelty < 0.3;

  const selectedRun = useMemo(
    () => runs.find((r) => r.id === selectedRunId) || null,
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
                <div>{selectedRun.date}</div>
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
          config={{ novelty: { label: "Novelty", color: "hsl(var(--chart-1))" } }}
        >
          <LineChart
            data={trend}
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            onMouseMove={(e: any) =>
              typeof e.activeTooltipIndex === "number"
                ? setHoveredIndex(e.activeTooltipIndex)
                : setHoveredIndex(null)
            }
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <XAxis dataKey="index" hide />
            <YAxis domain={[0, 1]} hide />
            <ChartTooltip />
            <Line
              type="monotone"
              dataKey="novelty"
              stroke="var(--color-novelty)"
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

