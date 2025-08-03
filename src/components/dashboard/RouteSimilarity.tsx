import React, { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { lineString, bezierSpline, bbox } from '@turf/turf'

import { Card } from '@/components/ui/card'
import { SimpleSelect } from '@/components/ui/select'
import Slider from '@/components/ui/slider'
import { getMockRoutes, Route } from '@/lib/api'
import useRouteSimilarity from '@/hooks/useRouteSimilarity'

export default function RouteSimilarity() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeAIndex, setRouteAIndex] = useState('0')
  const [routeBIndex, setRouteBIndex] = useState('1')
  const [precision, setPrecision] = useState(3)

  useEffect(() => {
    getMockRoutes().then((rs) => {
      setRoutes(rs)
      if (rs.length > 0) setRouteAIndex('0')
      if (rs.length > 1) setRouteBIndex('1')
    })
  }, [])

  const routeA = routes[parseInt(routeAIndex)]
  const routeB = routes[parseInt(routeBIndex)]

  const similarity = useRouteSimilarity(routeA, routeB, precision)

  const mapMatchRoute = (route: Route) =>
    bezierSpline(lineString(route.points.map((p) => [p.lon, p.lat])))

  const routeAFeature = useMemo(
    () => (routeA ? mapMatchRoute(routeA) : null),
    [routeA],
  )

  const routeBFeature = useMemo(
    () => (routeB ? mapMatchRoute(routeB) : null),
    [routeB],
  )

  const bounds = useMemo(() => {
    if (!routeAFeature || !routeBFeature) return null
    const [minLngA, minLatA, maxLngA, maxLatA] = bbox(routeAFeature)
    const [minLngB, minLatB, maxLngB, maxLatB] = bbox(routeBFeature)
    const minLng = Math.min(minLngA, minLngB)
    const minLat = Math.min(minLatA, minLatB)
    const maxLng = Math.max(maxLngA, maxLngB)
    const maxLat = Math.max(maxLatA, maxLatB)
    return [
      [minLng, minLat],
      [maxLng, maxLat],
    ] as [[number, number], [number, number]]
  }, [routeAFeature, routeBFeature])

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 20 })
    }
  }, [bounds])

  if (!routeA || !routeB || !routeAFeature || !routeBFeature || !bounds) {
    return <Card className="p-4">Loading routes...</Card>
  }

  return (
    <Card className="p-4 space-y-2">
      <h2 className="font-semibold">Route Similarity</h2>
      <div className="flex gap-4 flex-wrap">
        <SimpleSelect
          label="Route A"
          value={routeAIndex}
          onValueChange={setRouteAIndex}
          options={routes.map((r, i) => ({ value: String(i), label: r.name }))}
        />
        <SimpleSelect
          label="Route B"
          value={routeBIndex}
          onValueChange={setRouteBIndex}
          options={routes.map((r, i) => ({ value: String(i), label: r.name }))}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm">Precision: {precision}</label>
          <Slider
            min={1}
            max={6}
            step={1}
            value={[precision]}
            onValueChange={(val) => setPrecision(val[0])}
            className="w-40"
          />
        </div>
      </div>
      <p>
        Comparing <span className="font-medium">{routeA.name}</span> with{' '}
        <span className="font-medium">{routeB.name}</span>.
      </p>
      <div className="h-64 w-full">
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          initialViewState={{
            bounds,
            fitBoundsOptions: { padding: 20 },
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          {routeAFeature && (
            <Source id="routeA" type="geojson" data={routeAFeature}>
              <Layer
                id="routeA-line"
                type="line"
                paint={{ 'line-color': '#3b82f6', 'line-width': 4 }}
              />
            </Source>
          )}
          {routeBFeature && (
            <Source id="routeB" type="geojson" data={routeBFeature}>
              <Layer
                id="routeB-line"
                type="line"
                paint={{ 'line-color': '#ef4444', 'line-width': 4 }}
              />
            </Source>
          )}
        </Map>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Route A is shown in blue and Route B in red. The percentages below
        show the overlap (Jaccard), Dynamic Time Warping (DTW), and the maximum
        of the two metrics.
      </p>
      {similarity != null && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Jaccard similarity: {(similarity.overlapSimilarity * 100).toFixed(1)}%</p>
          <p>DTW similarity: {(similarity.dtwSimilarity * 100).toFixed(1)}%</p>
          <p>Max similarity: {(similarity.maxSimilarity * 100).toFixed(1)}%</p>
        </div>
      )}
    </Card>
  )
}

