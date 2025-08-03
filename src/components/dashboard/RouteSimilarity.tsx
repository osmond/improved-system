import React, { useEffect, useMemo, useState } from 'react'
import Map, { Source, Layer } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { lineString, bezierSpline } from '@turf/turf'

import { Card } from '@/components/ui/card'
import { SimpleSelect } from '@/components/ui/select'
import Slider from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { getMockRoutes, Route } from '@/lib/api'
import useRouteSimilarity from '@/hooks/useRouteSimilarity'

export default function RouteSimilarity() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeAIndex, setRouteAIndex] = useState('0')
  const [routeBIndex, setRouteBIndex] = useState('1')
  const [precision, setPrecision] = useState(3)
  const [error, setError] = useState<string | null>(null)

  const fetchRoutes = async () => {
    try {
      setError(null)
      setRoutes([])
      const rs = await getMockRoutes()
      setRoutes(rs)
      if (rs.length > 0) setRouteAIndex('0')
      if (rs.length > 1) setRouteBIndex('1')
    } catch (e) {
      setError('Failed to load routes')
    }
  }

  useEffect(() => {
    fetchRoutes()
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

  const center = routeA?.points[0]

  if (error) {
    return (
      <Card className="p-4 space-y-2">
        <p>{error}</p>
        <Button onClick={fetchRoutes}>Retry</Button>
      </Card>
    )
  }

  if (!routeA || !routeB || !center) {
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
          key={`${routeAIndex}-${routeBIndex}`}
          mapLib={maplibregl}
          initialViewState={{
            latitude: center.lat,
            longitude: center.lon,
            zoom: 13,
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

