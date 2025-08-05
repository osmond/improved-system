import React, { useRef, useEffect, useMemo, useState } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleOrdinal } from 'd3-scale';
import { brushX } from 'd3-brush';
import { axisBottom } from 'd3-axis';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { schemeTableau10 } from 'd3-scale-chromatic';

const WIDTH = 600;
const BAR_HEIGHT = 30;
const LANE_PADDING = 5;
const LANE_HEIGHT = BAR_HEIGHT + LANE_PADDING;
const BRUSH_HEIGHT = 10;
const AXIS_HEIGHT = 20;

const getDurationBucket = (duration) => {
  if (duration < 30) return 'short';
  if (duration < 60) return 'medium';
  return 'long';
};

const colorScale = scaleOrdinal()
  .domain(['short', 'medium', 'long'])
  .range(schemeTableau10.slice(0, 3));

const colorScaleMapper = (d) => colorScale(d.bucket);

export default function ReadingTimeline({ sessions = [] }) {
  const ref = useRef(null);
  const brushRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);

  const laneMap = useMemo(() => {
    const map = new Map();
    sessions.forEach((s) => {
      if (!map.has(s.asin)) {
        map.set(s.asin, map.size);
      }
    });
    return map;
  }, [sessions]);

  const lanes = laneMap.size || 1;
  const height = lanes * LANE_HEIGHT + LANE_PADDING;

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!sessions.length) return;

    const parsed = sessions.map((s) => ({
      ...s,
      startDate: new Date(s.start),
      endDate: new Date(s.end),
      lane: laneMap.get(s.asin),
      bucket: getDurationBucket(s.duration),
    }));
    const longest = parsed.reduce((a, b) => (a.duration > b.duration ? a : b));
    const shortest = parsed.reduce((a, b) => (a.duration < b.duration ? a : b));
    const min = Math.min(...parsed.map((d) => d.startDate.getTime()));
    const max = Math.max(...parsed.map((d) => d.endDate.getTime()));
    const initialDomain = [min, max];
    const x = scaleTime().domain(initialDomain).range([0, WIDTH]);

    svg.attr('viewBox', `0 0 ${WIDTH} ${height + BRUSH_HEIGHT + AXIS_HEIGHT}`);

    const barsG = svg.append('g').attr('transform', `translate(0,${BRUSH_HEIGHT})`);
    const axisG = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${BRUSH_HEIGHT + height})`);
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
        .attr('y', (d) => d.lane * LANE_HEIGHT + LANE_PADDING)
        .attr('width', (d) => Math.max(1, x(d.endDate) - x(d.startDate)))
        .attr('height', BAR_HEIGHT)
        .attr('fill', colorScaleMapper);

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
          .attr(
            'y',
            session.lane * LANE_HEIGHT + LANE_PADDING - 2,
          )
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
          setZoomed(true);
        } else {
          renderBars(initialDomain);
          setZoomed(false);
        }
      });

    svg.append('g').attr('class', 'brush').call(brush);

    // expose brush for tests
    ref.current.__brush = brush;
    brushRef.current = brush;
  }, [sessions, laneMap, height]);

  const reset = () => {
    if (brushRef.current && ref.current) {
      select(ref.current).select('.brush').call(brushRef.current.move, null);
    }
  };

  return (
    <div>
      <svg
        ref={ref}
        style={{ width: '100%', height: height + BRUSH_HEIGHT + AXIS_HEIGHT }}
      />
      <button onClick={reset} disabled={!zoomed} aria-label="Reset zoom">
        Reset
      </button>
    </div>
  );
}
