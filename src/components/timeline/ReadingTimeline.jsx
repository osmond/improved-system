import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleOrdinal } from 'd3-scale';
import { brushX } from 'd3-brush';

const WIDTH = 600;
const HEIGHT = 40;
const BRUSH_HEIGHT = 10;

export default function ReadingTimeline({ sessions = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!sessions.length) return;

    const color = scaleOrdinal()
      .domain(['short', 'medium', 'long'])
      .range(['#4CAF50', '#2196F3', '#FFC107']);

    const durationBucket = (mins) => {
      if (mins < 20) return 'short';
      if (mins < 40) return 'medium';
      return 'long';
    };

    const parsed = sessions.map((s) => ({
      ...s,
      startDate: new Date(s.start),
      endDate: new Date(s.end),
      bucket: durationBucket(s.duration),
    }));
    const min = Math.min(...parsed.map((d) => d.startDate.getTime()));
    const max = Math.max(...parsed.map((d) => d.endDate.getTime()));
    const initialDomain = [min, max];
    const x = scaleTime().domain(initialDomain).range([0, WIDTH]);

    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT + BRUSH_HEIGHT}`);

    const barsG = svg.append('g').attr('transform', `translate(0,${BRUSH_HEIGHT})`);

    const renderBars = (domain = initialDomain) => {
      x.domain(domain);
      barsG.selectAll('*').remove();
      const bars = barsG
        .selectAll('rect')
        .data(parsed)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.startDate))
        .attr('y', 5)
        .attr('width', (d) => Math.max(1, x(d.endDate) - x(d.startDate)))
        .attr('height', 30)
        .attr('fill', (d) => color(d.bucket));

      bars
        .append('title')
        .text(
          (d) =>
            `${d.title}\n${d.duration.toFixed(1)} min, ${d.highlights} highlights`,
        );
    };

    renderBars();

    const brush = brushX()
      .extent([
        [0, 0],
        [WIDTH, BRUSH_HEIGHT],
      ])
      .on('end', (event) => {
        if (event.selection) {
          const [x0, x1] = event.selection.map(x.invert);
          renderBars([x0, x1]);
        } else {
          renderBars(initialDomain);
        }
      });

    svg.append('g').attr('class', 'brush').call(brush);

    // expose brush for tests
    ref.current.__brush = brush;
  }, [sessions]);

  return (
    <svg
      ref={ref}
      style={{ width: '100%', height: HEIGHT + BRUSH_HEIGHT }}
    />
  );
}
