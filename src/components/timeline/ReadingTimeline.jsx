import React, { useRef, useEffect, useMemo, useState } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleOrdinal, scaleLinear } from 'd3-scale';
import { brushX, brushSelection } from 'd3-brush';
import { axisBottom } from 'd3-axis';
import { timeMonth } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const DEFAULT_WIDTH = 600;
const BAR_HEIGHT = 30;
const LANE_PADDING = 5;
const LANE_HEIGHT = BAR_HEIGHT + LANE_PADDING;
const BRUSH_HEIGHT = 10;
const AXIS_HEIGHT = 40;
const MIN_HEIGHT = 120;

/**
 * Timeline of reading sessions using a d3 brush.
 * Keyboard shortcuts:
 * - Arrow keys adjust the current brush selection.
 * - Enter applies the current selection.
 */
export default function ReadingTimeline({ sessions = [] }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const brushRef = useRef(null);
  const adjustingRef = useRef(false);
  const [zoomed, setZoomed] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

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

  const height = Math.max(MIN_HEIGHT, lanes * LANE_HEIGHT + LANE_PADDING);

  const titles = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.title))),
    [sessions],
  );
  const colorScale = useMemo(() => {
    const colors = Array.from({ length: 10 }, (_, i) => `hsl(var(--chart-${i + 1}))`);
    return scaleOrdinal().domain(titles).range(colors);
  }, [titles]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth || DEFAULT_WIDTH;
        setWidth(w);
      }
    };
    handleResize();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(handleResize);
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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
    const x = scaleTime().domain(initialDomain).range([0, width]);

    svg.attr('viewBox', `0 0 ${width} ${height + BRUSH_HEIGHT + AXIS_HEIGHT}`);

    const barsG = svg.append('g').attr('transform', `translate(0,${BRUSH_HEIGHT})`);
    const axisG = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${BRUSH_HEIGHT + height})`);
    const xAxis = axisBottom(x)
      .ticks(timeMonth.every(3))
      .tickFormat(timeFormat('%b'))
      .tickSize(-height)
      .tickSizeOuter(0);

    const opacityScale = scaleLinear()
      .domain([shortest.duration, longest.duration])
      .range([0.3, 1]);

    const renderBars = (domain = initialDomain) => {
      x.domain(domain);
      barsG.selectAll('*').remove();
      const barGroups = barsG
        .selectAll('g')
        .data(parsedSessions)
        .enter()
        .append('g')
        .attr('role', 'group');

      const bars = barGroups
        .append('rect')
        .attr('x', (d) => x(d.startDate))
        .attr('y', (d) => d.lane * LANE_HEIGHT + LANE_PADDING)
        .attr('width', (d) => Math.max(1, x(d.endDate) - x(d.startDate)))
        .attr('height', BAR_HEIGHT)
        .attr('fill', (d) => colorScale(d.title))
        .attr('fill-opacity', (d) => opacityScale(d.duration))
        .attr('tabindex', 0)
        .attr(
          'aria-label',
          (d) =>
            `${d.title}, ${d.duration.toFixed(1)} minutes, ${d.highlights} highlights`,
        )
        .on('focus', function () {
          select(this).attr('stroke', '#000').attr('stroke-width', 2);
        })
        .on('blur', function () {
          select(this).attr('stroke', null).attr('stroke-width', null);
        });

      bars
        .append('title')
        .text(
          (d) =>
            `${d.title}\n${d.duration.toFixed(1)} min, ${d.highlights} highlights`,
        );

      axisG.call(xAxis);
      axisG
        .selectAll('.tick line')
        .attr('stroke', '#ccc')
        .attr('stroke-opacity', 0.3);
      axisG.selectAll('.axis-label').remove();
      axisG
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', AXIS_HEIGHT - 5)
        .attr('text-anchor', 'middle')
        .text('Date');

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
        [width, BRUSH_HEIGHT],
      ])
      .on('end', (event) => {
        if (adjustingRef.current) return;
        if (event.selection) {
          const [x0, x1] = event.selection.map(x.invert);
          renderBars([x0, x1]);
          setZoomed(true);
        } else {
          renderBars(initialDomain);
          setZoomed(false);
        }
      });

    const brushG = svg.append('g').attr('class', 'brush');
    brushG.call(brush);
    brushG
      .attr('tabindex', 0)
      .attr(
        'aria-label',
        'Timeline selection. Use arrow keys to adjust and Enter to apply.',
      )
      .on('focus', function () {
        select(this).style('outline', '2px solid #000');
      })
      .on('blur', function () {
        select(this).style('outline', 'none');
      })
      .on('keydown', (event) => {
        const step = width / 100;
        let sel = brushSelection(brushG.node());
        if (!sel) sel = [0, width];
        switch (event.key) {
          case 'ArrowLeft':
            sel = [Math.max(0, sel[0] - step), Math.max(step, sel[1] - step)];
            adjustingRef.current = true;
            brush.move(brushG, sel);
            adjustingRef.current = false;
            event.preventDefault();
            break;
          case 'ArrowRight':
            sel = [Math.min(width - step, sel[0] + step), Math.min(width, sel[1] + step)];
            adjustingRef.current = true;
            brush.move(brushG, sel);
            adjustingRef.current = false;
            event.preventDefault();
            break;
          case 'ArrowUp':
            sel = [Math.max(0, sel[0] - step), Math.min(width, sel[1] + step)];
            adjustingRef.current = true;
            brush.move(brushG, sel);
            adjustingRef.current = false;
            event.preventDefault();
            break;
          case 'ArrowDown':
            if (sel[1] - sel[0] > step * 2) {
              sel = [sel[0] + step, sel[1] - step];
              adjustingRef.current = true;
              brush.move(brushG, sel);
              adjustingRef.current = false;
              event.preventDefault();
            }
            break;
          case 'Enter':
            if (sel) {
              const [x0, x1] = sel.map(x.invert);
              renderBars([x0, x1]);
              setZoomed(true);
            } else {
              renderBars(initialDomain);
              setZoomed(false);
            }
            event.preventDefault();
            break;
          default:
            break;
        }
      });

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
    <div ref={containerRef}>
      <svg
        ref={ref}
        style={{ width: '100%', height: height + BRUSH_HEIGHT + AXIS_HEIGHT }}
      />
      <p
        style={{ fontSize: '0.875rem', color: '#555', margin: '0.5rem 0' }}
      >
        Drag across the timeline to zoom; use Reset to return.
      </p>
      {titles.length > 0 && (
        <ul
          aria-label="Books"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            listStyle: 'none',
            padding: 0,
            margin: '0.5rem 0',
          }}
        >
          {titles.map((t) => (
            <li
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colorScale(t),
                  display: 'inline-block',
                }}
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
      {zoomed && (
        <button onClick={reset} aria-label="Reset zoom">
          Reset
        </button>
      )}
    </div>
  );
}
