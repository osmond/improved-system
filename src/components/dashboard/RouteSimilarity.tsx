import React, { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { lineString, bezierSpline, lineOverlap, bbox } from '@turf/turf'

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

  const bounds = useMemo(() => {
    if (routeAFeature && routeBFeature) {
      const a = bbox(routeAFeature)
      const b = bbox(routeBFeature)
      return [
        [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
        [Math.max(a[2], b[2]), Math.max(a[3], b[3])],
      ] as [[number, number], [number, number]]
    }
    if (routeAFeature) {
      const a = bbox(routeAFeature)
      return [
        [a[0], a[1]],
        [a[2], a[3]],
      ] as [[number, number], [number, number]]
    }
    if (routeBFeature) {
      const b = bbox(routeBFeature)
      return [
        [b[0], b[1]],
        [b[2], b[3]],
      ] as [[number, number], [number, number]]
    }
    return null
  }, [routeAFeature, routeBFeature])

  const mapRef = useRef<MapRef | null>(null)

  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(bounds, { padding: 40 })
    }
  }, [bounds])

  const overlapFeature = useMemo(() => {
    if (routeAFeature && routeBFeature) {
      const overlap = lineOverlap(routeAFeature, routeBFeature, {
        tolerance: 0.0001,
      })
      return overlap.features.length ? overlap : null
    }
    return null
  }, [routeAFeature, routeBFeature])

  const createPoint = (lat: number, lon: number) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [lon, lat],
    },
  })

  const routeAStart = useMemo(
    () => (routeA ? createPoint(routeA.points[0].lat, routeA.points[0].lon) : null),
    [routeA],
  )
  const routeAEnd = useMemo(
    () =>
      routeA
        ? createPoint(
            routeA.points[routeA.points.length - 1].lat,
            routeA.points[routeA.points.length - 1].lon,
          )
        : null,
    [routeA],
  )
  const routeBStart = useMemo(
    () => (routeB ? createPoint(routeB.points[0].lat, routeB.points[0].lon) : null),
    [routeB],
  )
  const routeBEnd = useMemo(
    () =>
      routeB
        ? createPoint(
            routeB.points[routeB.points.length - 1].lat,
            routeB.points[routeB.points.length - 1].lon,
          )
        : null,
    [routeB],
  )

  if (error) {
    return (
      <Card className="p-4 space-y-2">
        <p>{error}</p>
        <Button onClick={fetchRoutes}>Retry</Button>
      </Card>
    )
  }

  if (!routeA || !routeB || !bounds) {
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
          mapLib={maplibregl}
          ref={mapRef}
          initialViewState={{ bounds, fitBoundsOptions: { padding: 40 } }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          {routeAFeature && (
            <Source id="routeA" type="geojson" data={routeAFeature}>
              <Layer
                id="routeA-line"
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                  'line-width': 4,
                  'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0,
                    '#93c5fd',
                    1,
                    '#1e3a8a',
                  ],
                }}
              />
            </Source>
          )}
          {routeBFeature && (
            <Source id="routeB" type="geojson" data={routeBFeature}>
              <Layer
                id="routeB-line"
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                  'line-color': '#ef4444',
                  'line-width': 4,
                  'line-dasharray': [2, 2],
                }}
              />
            </Source>
          )}
          {overlapFeature && (
            <Source id="overlap" type="geojson" data={overlapFeature}>
              <Layer
                id="overlap-line"
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                  'line-width': 6,
                  'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0,
                    '#6ee7b7',
                    1,
                    '#047857',
                  ],
                }}
              />
            </Source>
          )}
          {routeAStart && (
            <Source id="routeA-start" type="geojson" data={routeAStart}>
              <Layer
                id="routeA-start-circle"
                type="circle"
                paint={{
                  'circle-color': '#3b82f6',
                  'circle-radius': 5,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2,
                }}
              />
            </Source>
          )}
          {routeAEnd && (
            <Source id="routeA-end" type="geojson" data={routeAEnd}>
              <Layer
                id="routeA-end-circle"
                type="circle"
                paint={{
                  'circle-color': '#1e3a8a',
                  'circle-radius': 5,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2,
                }}
              />
            </Source>
          )}
          {routeBStart && (
            <Source id="routeB-start" type="geojson" data={routeBStart}>
              <Layer
                id="routeB-start-circle"
                type="circle"
                paint={{
                  'circle-color': '#ef4444',
                  'circle-radius': 5,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2,
                }}
              />
            </Source>
          )}
          {routeBEnd && (
            <Source id="routeB-end" type="geojson" data={routeBEnd}>
              <Layer
                id="routeB-end-circle"
                type="circle"
                paint={{
                  'circle-color': '#7f1d1d',
                  'circle-radius': 5,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2,
                }}
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

