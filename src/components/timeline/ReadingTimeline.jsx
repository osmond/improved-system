import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { scaleTime } from 'd3-scale';

const WIDTH = 600;
const HEIGHT = 40;

export default function ReadingTimeline({ sessions = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!sessions.length) return;

    const parsed = sessions.map((s) => ({
      ...s,
      startDate: new Date(s.start),
      endDate: new Date(s.end),
    }));
    const min = Math.min(...parsed.map((d) => d.startDate.getTime()));
    const max = Math.max(...parsed.map((d) => d.endDate.getTime()));
    const x = scaleTime().domain([min, max]).range([0, WIDTH]);
    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
    svg
      .selectAll('rect')
      .data(parsed)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.startDate))
      .attr('y', 5)
      .attr('width', (d) => Math.max(1, x(d.endDate) - x(d.startDate)))
      .attr('height', 30)
      .attr('fill', 'steelblue')
      .append('title')
      .text(
        (d) =>
          `${d.title}\n${d.duration.toFixed(1)} min, ${d.highlights} highlights`,
      );
  }, [sessions]);

  return <svg ref={ref} style={{ width: '100%', height: HEIGHT }} />;
}
