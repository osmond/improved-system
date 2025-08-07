import React, { useRef, useEffect, useMemo, useState } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleOrdinal, scaleLinear } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';

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
const TOP_N = 5;


const PATTERN_STYLES = [
  'repeating-linear-gradient(45deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)',
  'repeating-linear-gradient(-45deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)',
  'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)',
  'repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)',
  'repeating-linear-gradient(45deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
  'repeating-linear-gradient(-45deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
];

export default function ReadingTimeline({
  sessions = [],
  colorBlindFriendly = false,
}) {

  const ref = useRef(null);
  const containerRef = useRef(null);
  const brushRef = useRef(null);
  const adjustingRef = useRef(false);
  const [zoomed, setZoomed] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [showLegend, setShowLegend] = useState(false);
  const [search, setSearch] = useState('');
  const [colorBy, setColorBy] = useState('title');
  const [minDuration, setMinDuration] = useState(0);
  const [minHighlights, setMinHighlights] = useState(0);

  const filteredSessions = useMemo(() => {
    const term = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.duration >= minDuration &&
        s.highlights >= minHighlights &&
        (!term || s.title.toLowerCase().includes(term)),
    );
  }, [sessions, search, minDuration, minHighlights]);

  const groupCounts = useMemo(() => {
    const counts = new Map();
    filteredSessions.forEach((s) => {
      const key = s[colorBy] || 'Other';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [filteredSessions, colorBy]);

  const topKeys = useMemo(
    () => groupCounts.slice(0, TOP_N).map(([key]) => key),
    [groupCounts],
  );

  const legendKeys = useMemo(() => {
    const list = [...topKeys];
    if (groupCounts.length > TOP_N) list.push('Other');
    return list;
  }, [topKeys, groupCounts.length]);

  const colorScale = useMemo(() => {
    const colors = schemeTableau10.slice(0, topKeys.length);
    if (groupCounts.length > TOP_N) colors.push('#ccc');
    return scaleOrdinal().domain(legendKeys).range(colors);
  }, [legendKeys, topKeys.length, groupCounts.length]);

  const sessionsWithCat = useMemo(
    () =>
      filteredSessions.map((s) => ({
        ...s,
        category: topKeys.includes(s[colorBy]) ? s[colorBy] : 'Other',
      })),
    [filteredSessions, topKeys, colorBy],
  );

  const { parsedSessions, lanes } = useMemo(() => {
    const parsed = sessionsWithCat
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
  }, [sessionsWithCat]);

  const height = Math.max(MIN_HEIGHT, lanes * LANE_HEIGHT + LANE_PADDING);
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
    svg
      .selectAll('*')
      .filter(function () {
        const tag = this.tagName.toLowerCase();
        return tag !== 'title' && tag !== 'desc';
      })
      .remove();
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
      .ticks(timeMonth.every(4))
      .tickFormat((d) =>
        d.getMonth() === 0
          ? timeFormat('%b %Y')(d)
          : timeFormat('%b')(d),
      )
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
        .attr('fill', (d) => colorScale(d.category))
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <label>
          Color by:
          <select
            aria-label="Color by"
            value={colorBy}
            onChange={(e) => setColorBy(e.target.value)}
            style={{ marginLeft: '0.25rem' }}
          >
            <option value="title">Title</option>
            <option value="genre">Genre</option>
          </select>
        </label>
        <label>
          Min duration
          <input
            type="number"
            aria-label="Min duration"
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value) || 0)}
            style={{ width: 60, marginLeft: '0.25rem' }}
          />
        </label>
        <label>
          Min highlights
          <input
            type="number"
            aria-label="Min highlights"
            value={minHighlights}
            onChange={(e) => setMinHighlights(Number(e.target.value) || 0)}
            style={{ width: 60, marginLeft: '0.25rem' }}
          />
        </label>
      </div>
      <svg
        ref={ref}
        role="img"
        aria-labelledby="reading-timeline-title reading-timeline-desc"
        style={{ width: '100%', height: height + BRUSH_HEIGHT + AXIS_HEIGHT }}
      >
        <title id="reading-timeline-title">Reading timeline chart</title>
        <desc id="reading-timeline-desc">
          Drag the brush below the chart to zoom into a specific time range.
        </desc>
      </svg>
      {zoomed && (
        <button
          onClick={() => {
            reset();
            setZoomed(false);
          }}
          style={{ marginTop: '0.5rem' }}
        >
          Reset
        </button>
      )}

      {legendKeys.length > 0 && showLegend && (
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
          {legendKeys.map((t, idx) => (
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
                  backgroundImage: colorBlindFriendly
                    ? PATTERN_STYLES[idx % PATTERN_STYLES.length]
                    : 'none',
                  display: 'inline-block',
                }}
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setShowLegend((v) => !v)}
        aria-expanded={showLegend}
        style={{ marginTop: '0.5rem' }}
      >
        {showLegend
          ? `Hide ${colorBy === 'title' ? 'books' : colorBy}`
          : `Show ${colorBy === 'title' ? 'books' : colorBy}...`}
      </button>
    </div>
  );
}
