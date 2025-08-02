import { useEffect, useMemo, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { getLocationVisits, type LocationVisit } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapView() {
  const [visits, setVisits] = useState<LocationVisit[] | null>(null);

  useEffect(() => {
    getLocationVisits().then(setVisits);
  }, []);

  const geojson = useMemo(() => {
    if (!visits) return null;
    const features = visits.map((v) => {
      const [lat, lon] = v.placeId.split(",").map(Number);
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [lon, lat] },
        properties: { category: v.category },
      };
    });
    return { type: "FeatureCollection" as const, features };
  }, [visits]);

  if (!geojson) return <Skeleton className="h-64" />;

  return (
    <div className="h-64 w-full">
      <Map
        mapLib={maplibregl}
        mapStyle="https://demotiles.maplibre.org/style.json"
        initialViewState={{ longitude: -93, latitude: 44, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Source id="visits" type="geojson" data={geojson} cluster clusterRadius={40}>
          <Layer
            id="clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "hsl(var(--chart-3))",
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
            layout={{ "text-field": "{point_count}", "text-size": 12 }}
          />
          <Layer
            id="unclustered-point"
            type="circle"
            filter={["!", ["has", "point_count"]]}
            paint={{ "circle-color": "hsl(var(--chart-1))", "circle-radius": 6 }}
          />
        </Source>
      </Map>
    </div>
  );
}
