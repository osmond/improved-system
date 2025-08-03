'use client'

import { useEffect, useRef, useState } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'
import { select } from 'd3-selection'
import { geoOrthographic, geoPath } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { drag } from 'd3-drag'
import { feature, mesh } from 'topojson-client'

function GlobeRenderer({
  paths,
  totalMiles,
  centroid,
}: {
  paths: [number, number][][]
  totalMiles: number
  centroid: [number, number]
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 })

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const update = () =>
      setDimensions({ width: svg.clientWidth, height: svg.clientHeight })

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
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
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

    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((world) => {
        const land = feature(world, world.objects.countries)
        const boundaries = mesh(
          world,
          world.objects.countries,
          (a, b) => a !== b
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

        linePaths = paths.map((coordinates) =>
          svg
            .append('path')
            .datum({ type: 'LineString', coordinates } as any)
            .attr('fill', 'none')
            .attr('stroke', 'var(--primary-foreground)')
            .attr(
              'stroke-width',
              Math.max(2, Math.min(10, 1 + totalMiles / 50))
            )
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0.8),
        )

        render()
      })

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
  }, [paths, totalMiles, dimensions, centroid])

  return (
    <div className='relative aspect-square w-full'>
      <svg
        ref={svgRef}
        className='h-full w-full rounded'
        preserveAspectRatio='xMidYMid meet'
      />
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
  const paths = data.map((p) => p.coordinates as [number, number][])
  const allCoords = paths.flat()

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
      <GlobeRenderer paths={paths} totalMiles={totalMiles} centroid={centroid} />
      <div className='rounded bg-muted p-2 text-sm'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}

