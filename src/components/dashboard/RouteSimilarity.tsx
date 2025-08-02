import React, { useMemo } from 'react'
import Map, { Source, Layer } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { Card } from '@/components/ui/card'
import useRouteSimilarity from '@/hooks/useRouteSimilarity'

export default function RouteSimilarity() {
  const result = useRouteSimilarity()

  if (!result) {
    return <Card className="p-4">Calculating...</Card>
  }

  const { routeA, routeB, similarity } = result

  const routeAFeature = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeA.points.map((p) => [p.lon, p.lat]),
      },
    }),
    [routeA],
  )

  const routeBFeature = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeB.points.map((p) => [p.lon, p.lat]),
      },
    }),
    [routeB],
  )

  const center = routeA.points[0]

  return (
    <Card className="p-4 space-y-2">
      <h2 className="font-semibold">Route Similarity</h2>
      <p>
        Comparing <span className="font-medium">{routeA.name}</span> with{' '}
        <span className="font-medium">{routeB.name}</span>.
      </p>
      <div className="h-64 w-full">
        <Map
          mapLib={maplibregl}
          initialViewState={{
            latitude: center.lat,
            longitude: center.lon,
            zoom: 13,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <Source id="routeA" type="geojson" data={routeAFeature}>
            <Layer
              id="routeA-line"
              type="line"
              paint={{ 'line-color': '#3b82f6', 'line-width': 4 }}
            />
          </Source>
          <Source id="routeB" type="geojson" data={routeBFeature}>
            <Layer
              id="routeB-line"
              type="line"
              paint={{ 'line-color': '#ef4444', 'line-width': 4 }}
            />
          </Source>
        </Map>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Route A is shown in blue and Route B in red. The Jaccard percentage
        reflects the degree of overlap.
      </p>
      <p className="text-sm text-muted-foreground">
        Jaccard similarity: {(similarity * 100).toFixed(1)}%
      </p>
    </Card>
  )
}
