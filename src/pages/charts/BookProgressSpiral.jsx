import React, { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { lineRadial, curveCatmullRom } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import useReadingSessions from '@/hooks/useReadingSessions';
import CursorTooltip from '@/components/ui/cursor-tooltip';

export default function BookProgressSpiral() {
  const { data: sessions, error, isLoading } = useReadingSessions();
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    session: null,
  });

  const books = useMemo(() => {
    if (!sessions) return [];
    return Object.entries(
      sessions.reduce((acc, s) => {
        (acc[s.title] ||= []).push(s);
        return acc;
      }, {})
    );
  }, [sessions]);
  const color = useMemo(
    () => scaleOrdinal(schemeCategory10).domain(books.map(([title]) => title)),
    [books]
  );

  useEffect(() => {
    if (books.length === 0) return;

    const width = 800;
    const height = 800;

    const svg = select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const maxTime =
      books.length > 0
        ? Math.max(
            ...books.map(
              ([_, arr]) => new Date(arr[arr.length - 1].start) - new Date(arr[0].start)
            )
          )
        : 0;
    const radius =
      scaleLinear()
        .domain([0, maxTime])
        .range([20, Math.min(width, height) / 2 - 20]);

    const line = lineRadial().curve(curveCatmullRom.alpha(0.5));

    books.forEach(([title, arr]) => {
      arr.sort((a, b) => new Date(a.start) - new Date(b.start));
      const start = new Date(arr[0].start);
      const totalDuration = arr.reduce((sum, d) => sum + d.duration, 0);
      let cumulative = 0;
      let prevPoint = [0, radius(0)];

      arr.forEach((s) => {
        cumulative += s.duration;
        const angle = (2 * Math.PI * cumulative) / totalDuration;
        const r = radius(new Date(s.start) - start);
        const point = [angle, r];

        g
          .append('path')
          .datum({ ...s, title })
          .attr('d', line([prevPoint, point]))
          .attr('fill', 'none')
          .attr('stroke', color(title))
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .attr('tabindex', 0)
          .attr(
            'aria-label',
            `${title} session on ${new Date(s.start).toLocaleDateString()} for ${s.duration.toFixed(
              1,
            )} min`,
          )
          .on('mouseover', (event, d) => {
            setTooltip({
              visible: true,
              x: event.clientX,
              y: event.clientY,
              session: d,
            });
          })
          .on('mousemove', (event) => {
            setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY }));
          })
          .on('mouseout', () => setTooltip((t) => ({ ...t, visible: false })))
          .on('focus', function (event, d) {
            const rect = this.getBoundingClientRect();
            setTooltip({
              visible: true,
              x: rect.left + rect.width / 2,
              y: rect.top,
              session: d,
            });
          })
          .on('blur', () => setTooltip((t) => ({ ...t, visible: false })));

        prevPoint = point;
      });
    });
  }, [books, color]);

  if (error) return <div>Failed to load sessions</div>;
  if (isLoading) return <div>Loading sessions...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Book Progress Spiral</h1>
      <p className="text-sm text-gray-600 mb-4">
        The spiral illustrates how your reading sessions build over time: the radius shows
        how long a book has been in progress, while the angle tracks cumulative reading
        time, completing a full turn when the book is finished. Each color represents a
        different book.
      </p>
      {books.length > 0 ? (
        <> 
          <svg ref={svgRef} className="w-full max-w-[800px] h-[800px]" />
          <CursorTooltip
            x={tooltip.x}
            y={tooltip.y}
            visible={tooltip.visible}
          >
            {tooltip.session && (
              <div className="space-y-0.5">
                <div className="font-semibold">{tooltip.session.title}</div>
                <div>{new Date(tooltip.session.start).toLocaleDateString()}</div>
                <div>{tooltip.session.duration.toFixed(1)} min</div>
              </div>
            )}
          </CursorTooltip>
          <div className="mt-4 space-y-1">
            {books.map(([title]) => (
              <div key={title} className="flex items-center text-sm">
                <span
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: color(title) }}
                />
                {title}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>No session data</div>
      )}
    </div>
  );
}

