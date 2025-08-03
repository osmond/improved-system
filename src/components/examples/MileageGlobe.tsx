'use client'

import { useEffect, useRef, useState } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'
import { select } from 'd3-selection'
import { geoOrthographic, geoPath } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { drag } from 'd3-drag'
import { feature, mesh } from 'topojson-client'

function GlobeRenderer({
  runs,
  totalMiles,
  centroid,
}: {
  runs: { coordinates: [number, number][]; date: string; miles: number }[]
  totalMiles: number
  centroid: [number, number]
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 })
  const [worldData, setWorldData] = useState<any | null>(null)
  const [error, setError] = useState(false)
  const [tooltip, setTooltip] = useState<
    { x: number; y: number; date: string; miles: number } | null
  >(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const update = () => {
      const width = svg.clientWidth
      const height = svg.clientHeight
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    }

    update()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update)
      observer.observe(svg)
      return () => observer.disconnect()
    } else {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((world) => {
        setWorldData(world)
        setError(false)
      })
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    if (
      !svgRef.current ||
      dimensions.width === 0 ||
      dimensions.height === 0 ||
      !worldData
    )
      return

    const svg = select(svgRef.current)
    const { width, height } = dimensions

    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.selectAll('*').remove()

    const projection = geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 2 - 10)
      .rotate([-centroid[0], -centroid[1]])

    const geo = geoPath(projection)

    const sphere = svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('fill', '#1e3a8a')
      .attr('stroke', '#94a3b8')

    let landPath: any
    let boundaryPath: any
    let linePaths: any[] = []

    const render = () => {
      sphere.attr('d', geo as any)
      landPath?.attr('d', geo as any)
      boundaryPath?.attr('d', geo as any)
      linePaths.forEach((p) => p.attr('d', geo as any))
    }

    const land = feature(worldData, worldData.objects.countries)
    const boundaries = mesh(
      worldData,
      worldData.objects.countries,
      (a, b) => a !== b,
    )

    landPath = svg
      .append('path')
      .datum(land as any)
      .attr('fill', '#334155')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 0.5)

    boundaryPath = svg
      .append('path')
      .datum(boundaries as any)
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 0.5)

    linePaths = runs.map((run) =>
      svg
        .append('path')
        .datum({ type: 'LineString', coordinates: run.coordinates } as any)
        .attr('fill', 'none')
        .attr('stroke', 'var(--primary-foreground)')
        .attr('stroke-width', Math.max(2, Math.min(10, 1 + totalMiles / 50)))
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.8)
        .on('mouseenter', (event) => {
          const rect = svgRef.current?.getBoundingClientRect()
          setTooltip({
            x: event.clientX - (rect?.left ?? 0),
            y: event.clientY - (rect?.top ?? 0),
            date: run.date,
            miles: run.miles,
          })
        })
        .on('mouseleave', () => setTooltip(null)),
    )

    render()

    const initialScale = projection.scale()

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([initialScale / 2, initialScale * 8])
      .on('zoom', (event) => {
        const { k, x, y } = event.transform
        projection
          .scale(initialScale * k)
          .translate([width / 2 + x, height / 2 + y])
        render()
      })

    const dragBehavior = drag<SVGSVGElement, unknown>().on('drag', (event) => {
      const rotate = projection.rotate()
      const k = 1 / projection.scale()
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k])
      render()
    })

    svg.call(zoomBehavior as any)
    svg.call(dragBehavior as any)
  }, [runs, totalMiles, dimensions, centroid, worldData])

  return (
    <div className='relative aspect-square w-full'>
      {error ? (
        <div className='flex h-full w-full items-center justify-center rounded bg-muted text-muted-foreground'>
          Map unavailable
        </div>
      ) : (
        <svg
          ref={svgRef}
          className='h-full w-full rounded'
          preserveAspectRatio='xMidYMid meet'
        />
      )}
      {tooltip && (
        <div
          className='pointer-events-none absolute rounded bg-black/80 px-2 py-1 text-xs text-white'
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.date}: {tooltip.miles} miles
        </div>
      )}
    </div>
  )
}

export default function MileageGlobe({
  weekRange,
}: {
  weekRange?: [number, number]
}) {
  const data = useMileageTimeline(
    undefined,
    weekRange
      ? { startWeek: weekRange[0], endWeek: weekRange[1] }
      : undefined,
  )

  if (!data) {
    return (
      <div className='flex items-center justify-center h-96 w-full bg-muted text-muted-foreground rounded'>
        Loading mileage globe...
      </div>
    )
  }

  const totalMiles = data.reduce((sum, p) => sum + p.miles, 0)
  const runs = data.map((p) => ({
    coordinates: p.coordinates as [number, number][],
    date: p.date,
    miles: p.miles,
  }))
  const allCoords = runs.flatMap((r) => r.coordinates)

  let centroid: [number, number] = [0, 0]
  if (allCoords.length) {
    const [sumLng, sumLat] = allCoords.reduce(
      (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
      [0, 0],
    )
    centroid = [sumLng / allCoords.length, sumLat / allCoords.length]
  }

  return (
    <div className='space-y-2'>
      <GlobeRenderer runs={runs} totalMiles={totalMiles} centroid={centroid} />
      <div className='rounded bg-muted p-2 text-sm'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}

