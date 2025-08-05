import React, { useRef, useEffect, useMemo, useState } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleOrdinal } from 'd3-scale';
import { brushX } from 'd3-brush';
import { axisBottom } from 'd3-axis';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const CHART_COLORS = Array.from(
  { length: 10 },
  (_, i) => `hsl(var(--chart-${i + 1}))`,
);

const WIDTH = 600;
const BAR_HEIGHT = 30;
const LANE_PADDING = 5;
const LANE_HEIGHT = BAR_HEIGHT + LANE_PADDING;
const BRUSH_HEIGHT = 10;
const AXIS_HEIGHT = 20;


export default function ReadingTimeline({ sessions = [] }) {
  const ref = useRef(null);
  const brushRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);

  const { parsedSessions, lanes } = useMemo(() => {
    const parsed = sessions
      .map((s) => ({
        ...s,
        startDate: new Date(s.start),
        endDate: new Date(s.end),
      }))
      .sort((a, b) => a.startDate - b.startDate);

    const laneEnds = [];
    parsed.forEach((s) => {
      let lane = laneEnds.findIndex((end) => end <= s.startDate);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(s.endDate);
      } else {
        laneEnds[lane] = s.endDate;
      }
      s.lane = lane;
    });

    return { parsedSessions: parsed, lanes: laneEnds.length || 1 };
  }, [sessions]);

  const height = lanes * LANE_HEIGHT + LANE_PADDING;

  const genres = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.genre || 'Unknown'))),
    [sessions],
  );
  const colorScale = useMemo(
    () => scaleOrdinal().domain(genres).range(CHART_COLORS),
    [genres],
  );

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!parsedSessions.length) return;

    const longest = parsedSessions.reduce((a, b) =>
      a.duration > b.duration ? a : b,
    );
    const shortest = parsedSessions.reduce((a, b) =>
      a.duration < b.duration ? a : b,
    );
    const min = Math.min(
      ...parsedSessions.map((d) => d.startDate.getTime()),
    );
    const max = Math.max(
      ...parsedSessions.map((d) => d.endDate.getTime()),
    );
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
        .data(parsedSessions)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.startDate))
        .attr('y', (d) => d.lane * LANE_HEIGHT + LANE_PADDING)
        .attr('width', (d) => Math.max(1, x(d.endDate) - x(d.startDate)))
        .attr('height', BAR_HEIGHT)
        .attr('fill', (d) => colorScale(d.genre || 'Unknown'));

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
  }, [parsedSessions, height, colorScale]);

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
