import React, { useEffect, useMemo, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { lineRadial, curveCatmullRom } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import useReadingSessions from '@/hooks/useReadingSessions';

export default function BookProgressSpiral() {
  const { data: sessions, error, isLoading } = useReadingSessions();
  const svgRef = useRef(null);

  const books = useMemo(() => {
    if (!sessions) return [];
    return Object.entries(
      sessions.reduce((acc, s) => {
        (acc[s.title] ||= []).push(s);
        return acc;
      }, {})
    );
  }, [sessions]);

  useEffect(() => {
    if (books.length === 0) return;

    const width = 800;
    const height = 800;

    const svg = select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const color = scaleOrdinal(schemeCategory10).domain(books.map(([title]) => title));

    const maxTime = books.length > 0
      ? Math.max(
          ...books.map(
            ([_, arr]) =>
              new Date(arr[arr.length - 1].start) - new Date(arr[0].start)
          )
        )
      : 0;
    const radius = scaleLinear()
      .domain([0, maxTime])
      .range([20, Math.min(width, height) / 2 - 20]);

    const line = lineRadial().curve(curveCatmullRom.alpha(0.5));

    books.forEach(([title, arr]) => {
      arr.sort((a, b) => new Date(a.start) - new Date(b.start));
      const start = new Date(arr[0].start);
      const totalDuration = arr.reduce((sum, d) => sum + d.duration, 0);
      let cumulative = 0;

      const points = arr.map((s) => {
        cumulative += s.duration;
        const angle = (2 * Math.PI * cumulative) / totalDuration;
        const r = radius(new Date(s.start) - start);
        return [angle, r];
      });

      g.append('path')
        .attr('d', line(points))
        .attr('fill', 'none')
        .attr('stroke', color(title))
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);
    });
  }, [books]);

  if (error) return <div>Failed to load sessions</div>;
  if (isLoading) return <div>Loading sessions...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Book Progress Spiral</h1>
      {books.length > 0 ? (
        <svg ref={svgRef} className="w-full max-w-[800px] h-[800px]" />
      ) : (
        <div>No session data</div>
      )}
    </div>
  );
}

