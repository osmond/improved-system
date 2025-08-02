'use client'

import { useEffect, useRef } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'
import { select } from 'd3-selection'
import { geoOrthographic, geoPath } from 'd3-geo'

interface GlobePoint {
  date: string
  miles: number
  coordinates: [number, number][]
}

function GlobeRenderer({ points }: { points: GlobePoint[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = select(svgRef.current)
    const width = 400
    const height = 400

    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.selectAll('*').remove()

    const projection = geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 2 - 10)

    const path = geoPath(projection)

    svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('d', path as any)
      .attr('fill', '#1e3a8a')
      .attr('stroke', '#94a3b8')

    points.forEach((p) => {
      svg
        .append('path')
        .datum({ type: 'LineString', coordinates: p.coordinates })
        .attr('d', path as any)
        .attr('fill', 'none')
        .attr('stroke', 'var(--primary)')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8)
    })
  }, [points])

  return <svg ref={svgRef} className='h-96 w-full rounded' />
}

export default function MileageGlobe() {
  const data = useMileageTimeline()

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

  return <GlobeRenderer points={points} />
}

