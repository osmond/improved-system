'use client'

import { useEffect, useRef, useState } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'
import { select } from 'd3-selection'
import { geoOrthographic, geoPath } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { drag } from 'd3-drag'
import { feature, mesh } from 'topojson-client'

interface GlobePoint {
  date: string
  miles: number
  coordinates: [number, number][]
}

function GlobeRenderer({
  points,
  onSelect,
}: {
  points: GlobePoint[]
  onSelect: (point: GlobePoint) => void
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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
    const tooltip = select(tooltipRef.current)
    const { width, height } = dimensions

    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.selectAll('*').remove()

    const projection = geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 2 - 10)

    const path = geoPath(projection)

    const sphere = svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('fill', '#1e3a8a')
      .attr('stroke', '#94a3b8')

    let landPath: any
    let boundaryPath: any
    const linePaths: any[] = []

    const render = () => {
      sphere.attr('d', path as any)
      landPath?.attr('d', path as any)
      boundaryPath?.attr('d', path as any)
      linePaths.forEach((line) => line.attr('d', path as any))
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

        points.forEach((p) => {
          const line = svg
            .append('path')
            .datum({ type: 'LineString', coordinates: p.coordinates } as any)
            .attr('fill', 'none')
            .attr('stroke', 'var(--primary)')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.8)
            .on('mouseenter', (event) => {
              select(event.currentTarget)
                .attr('stroke-width', 3)
                .attr('opacity', 1)
              tooltip
                .style('display', 'block')
                .style('left', `${event.offsetX + 10}px`)
                .style('top', `${event.offsetY + 10}px`)
                .text(`${p.date}: ${p.miles} miles`)
            })
            .on('mousemove', (event) => {
              tooltip
                .style('left', `${event.offsetX + 10}px`)
                .style('top', `${event.offsetY + 10}px`)
            })
            .on('mouseleave', (event) => {
              select(event.currentTarget)
                .attr('stroke-width', 1.5)
                .attr('opacity', 0.8)
              tooltip.style('display', 'none')
            })
            .on('click', () => onSelect(p))
          linePaths.push(line)
        })

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
  }, [points, onSelect, dimensions])

  return (
    <div className='relative aspect-square w-full'>
      <svg
        ref={svgRef}
        className='h-full w-full rounded'
        preserveAspectRatio='xMidYMid meet'
      />
      <div
        ref={tooltipRef}
        className='pointer-events-none absolute hidden rounded bg-black/80 px-2 py-1 text-xs text-white'
      />
    </div>
  )
}

export default function MileageGlobe({ years = 1 }: { years?: number }) {
  const data = useMileageTimeline(years)
  const [selected, setSelected] = useState<GlobePoint | null>(null)

  if (!data) {
    return (
      <div className='flex items-center justify-center h-96 w-full bg-muted text-muted-foreground rounded'>
        Loading mileage globe...
      </div>
    )
  }

  const points: GlobePoint[] = data.map((p) => ({
    date: p.date,
    miles: p.miles,
    coordinates: p.coordinates,
  }))

  return (
    <div className='space-y-2'>
      <GlobeRenderer points={points} onSelect={setSelected} />
      {selected && (
        <div className='rounded bg-muted p-2 text-sm'>
          {selected.date}: {selected.miles} miles
        </div>
      )}
    </div>
  )
}

