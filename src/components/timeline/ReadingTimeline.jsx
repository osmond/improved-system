import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { axisBottom } from 'd3-axis';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const WIDTH = 600;
const HEIGHT = 40;
const BRUSH_HEIGHT = 10;
const AXIS_HEIGHT = 20;

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
    const longest = parsed.reduce((a, b) => (a.duration > b.duration ? a : b));
    const shortest = parsed.reduce((a, b) => (a.duration < b.duration ? a : b));
    const min = Math.min(...parsed.map((d) => d.startDate.getTime()));
    const max = Math.max(...parsed.map((d) => d.endDate.getTime()));
    const initialDomain = [min, max];
    const x = scaleTime().domain(initialDomain).range([0, WIDTH]);

    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT + BRUSH_HEIGHT + AXIS_HEIGHT}`);

    const barsG = svg.append('g').attr('transform', `translate(0,${BRUSH_HEIGHT})`);
    const axisG = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${BRUSH_HEIGHT + HEIGHT})`);
    const xAxis = axisBottom(x)
      .ticks(timeMonth.every(1))
      .tickFormat(timeFormat('%b'));

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
        .attr('fill', 'steelblue');

      bars
        .append('title')
        .text(
          (d) =>
            `${d.title}\n${d.duration.toFixed(1)} min, ${d.highlights} highlights`,
        );

      axisG.call(xAxis);

      barsG.selectAll('.annotation').remove();
      const annotate = (session, cls, label) => {
        const xPos =
          x(session.startDate) +
          Math.max(1, x(session.endDate) - x(session.startDate)) / 2;
        barsG
          .append('text')
          .attr('class', `annotation ${cls}`)
          .attr('x', xPos)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .text(label);
      };
      annotate(longest, 'annotation-longest', 'Longest');
      annotate(shortest, 'annotation-shortest', 'Shortest');
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
      style={{ width: '100%', height: HEIGHT + BRUSH_HEIGHT + AXIS_HEIGHT }}
    />
  );
}
