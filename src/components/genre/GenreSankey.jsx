import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';
import { zoom, zoomIdentity } from 'd3-zoom';
import transitions from '@/data/kindle/genre-transitions.json';
import { Skeleton } from '@/ui/skeleton';

export default function GenreSankey() {
  const svgRef = useRef(null);
  // Container specifically for the svg. The resize observer will measure this
  // element so that changes to the svg itself do not affect the measurement.
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const zoomRef = useRef(null);
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [filter, setFilter] = useState('');
  const [month, setMonth] = useState(0);
  const [playing, setPlaying] = useState(false);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/kindle/genre-transitions?start=${start}&end=${end}`,
      );
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await res.json();
      const mapped = json.map((d) => ({
        ...d,
        monthlyCounts: d.monthlyCounts || Array(12).fill(0),
      }));
      setRawData(mapped);
      setData(mapped);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleResetZoom = () => {
    if (zoomRef.current) {
      zoomRef.current();
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const mapped = transitions.map((d) => ({
        ...d,
        monthlyCounts: d.monthlyCounts || Array(12).fill(0),
      }));
      setRawData(mapped);
      setData(mapped);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!rawData) return;
    if (!filter) {
      setData(rawData);
      return;
    }
    const lower = filter.toLowerCase();
    const filtered = rawData.filter(
      (d) =>
        d.source.toLowerCase().includes(lower) ||
        d.target.toLowerCase().includes(lower),
    );
    setData(filtered);
  }, [filter, rawData]);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const newWidth = width || 600;
      const newHeight = height || 400;
      // Only update when the measured dimensions actually change. This avoids
      // triggering React renders that would cause ResizeObserver to fire again.
      setDimensions((prev) => {
        if (prev.width !== newWidth || prev.height !== newHeight) {
          return { width: newWidth, height: newHeight };
        }
        return prev;
      });
    };

    updateSize();
    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateSize);
      if (containerRef.current) observer.observe(containerRef.current);
    } else {
      window.addEventListener('resize', updateSize);
    }
    return () => {
      if (observer) observer.disconnect();
      else window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setMonth((m) => (m + 1) % 12);
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const { width, height } = dimensions;
    if (!data || data.length === 0 || width === 0 || height === 0) return;

    const genres = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));

    // compute totals per genre (incoming + outgoing) using overall counts to keep layout stable
    const totals = data.reduce((acc, { source, target, count }) => {
      acc[source] = (acc[source] || 0) + count;
      acc[target] = (acc[target] || 0) + count;
      return acc;
    }, {});

    // compute outgoing totals for the current month for percentage calculations
    const sourceTotals = data.reduce((acc, { source, monthlyCounts }) => {
      const v = (monthlyCounts && monthlyCounts[month]) || 0;
      acc[source] = (acc[source] || 0) + v;
      return acc;
    }, {});

    // build nodes sorted by descending total sessions
    const nodes = genres
      .map((name) => ({ name, total: totals[name] || 0 }))
      .sort((a, b) => b.total - a.total);

    const sortedGenres = nodes.map((d) => d.name);
    const indexByName = Object.fromEntries(nodes.map((d, i) => [d.name, i]));

    // rebuild links with indices matching sorted node order
    const links = data.map((d) => ({
      source: indexByName[d.source],
      target: indexByName[d.target],
      value: (d.monthlyCounts && d.monthlyCounts[month]) || 0,
      monthlyCounts: d.monthlyCounts || Array(12).fill(0),
    }));

    const { nodes: n, links: l } = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .nodeSort((a, b) => b.total - a.total)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ])({
        nodes: nodes.map((d) => ({ ...d })),
        links: links.map((d) => ({ ...d })),
      });

    // color scale using a color-blind safe palette
    const color = scaleOrdinal().domain(sortedGenres).range(schemeSet3);
    const barFill = schemeSet3[0];


    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const defs = svg.append('defs');
    const g = svg.append('g');

    const zoomBehavior = zoom()
      .scaleExtent([0.5, 4])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);
    zoomRef.current = () =>
      svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, zoomIdentity);

    const values = l.map((d) => d.value).sort((a, b) => a - b);
    const cutoff = values[Math.floor(values.length * 0.95)] || 0;

    const link = g
      .append('g')
      .selectAll('path')
      .data(l)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke-width', 0)
      .attr('opacity', (d) => (d.value < cutoff ? 0.3 : 1))
      .transition()
      .duration(750)
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .each(function (d, i) {
        const gradientId = `link-gradient-${i}`;
        const gradient = defs
          .append('linearGradient')
          .attr('id', gradientId)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', d.source.x1)
          .attr('x2', d.target.x0);
        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', color(d.source.name));
        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', color(d.target.name));
        select(this)
          .attr('stroke', `url(#${gradientId})`)
          .attr('tabindex', 0)
          .attr(
            'aria-label',
            `From ${d.source.name} to ${d.target.name}: ${d.value} sessions`,
          );
      })
      .on('mouseover focus', (event, d) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        let x = event.pageX ?? event.clientX;
        let y = event.pageY ?? event.clientY;
        if (x == null || y == null) {
          const rect = event.target?.getBoundingClientRect();
          if (rect) {
            x = rect.left + rect.width / 2 + window.scrollX;
            y = rect.top + rect.height / 2 + window.scrollY;
          } else {
            x = 0;
            y = 0;
          }
        }
        tooltip.style.display = 'block';
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        const percent = (
          (d.value / (sourceTotals[d.source.name] || d.value)) * 100
        ).toFixed(0);
        const text = `${d.source.name} → ${d.target.name}: ${d.value} sessions (${percent}% of ${d.source.name}) in ${monthNames[month]}`;
        const counts = d.monthlyCounts || [];
        const max = Math.max(...counts, 0);
        const barWidth = 5;
        const barHeight = 20;
        const bars = counts
          .map((c, i) => {
            const h = max ? (c / max) * barHeight : 0;
            return `<rect x="${i * barWidth}" y="${barHeight - h}" width="${barWidth - 1}" height="${h}" fill="${barFill}" />`;
          })
          .join('');
        tooltip.innerHTML = `<div>${text}</div><svg width="${counts.length * barWidth}" height="${barHeight}">${bars}</svg>`;
      })
      .on('mouseout blur', () => {
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.display = 'none';
      });

    // annotate major flows
    const labelData = l.filter((d) => d.value >= cutoff);
    g
      .append('g')
      .selectAll('text')
      .data(labelData)
      .join('text')
      .attr('x', (d) => (d.source.x1 + d.target.x0) / 2)
      .attr('y', (d) => d.y0 + (d.y1 - d.y0) / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text((d) => `${d.source.name} → ${d.target.name}: ${d.value}`);

    const node = g
      .append('g')
      .selectAll('g')
      .data(n)
      .join('g');

    node
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', (d) => color(d.name))
      .attr('tabindex', 0)
      .attr('aria-label', (d) => `${d.name}: ${d.value} sessions`);

    node
      .append('text')
      .attr('x', (d) => d.x0 - 6)
      .attr('y', (d) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d) => d.name)
      .filter((d) => d.x0 < width / 2)
      .attr('x', (d) => d.x1 + 6)
      .attr('text-anchor', 'start');
  }, [data, dimensions, month]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
      <label>
          Start
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          End
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label>
          Filter
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Genre name"
          />
        </label>
        <button onClick={fetchData} disabled={loading}>Apply</button>
        <button onClick={handleResetZoom}>Reset Zoom</button>
        <button onClick={() => setFilter('')}>Clear Filter</button>
        <label>
          Month
          <input
            type="range"
            min="0"
            max="11"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <span>{monthNames[month]}</span>
        </label>
        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '100%', flex: 1 }}
      >
        {error ? (
          <div role="alert">{error}</div>
        ) : loading || !data || data.length === 0 ? (
          <Skeleton
            className="h-full w-full"
            data-testid="genre-sankey-skeleton"
          />
        ) : (
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        )}
      </div>
      <div
        ref={tooltipRef}
        data-testid="tooltip"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          background: 'white',
          border: '1px solid #ccc',
          padding: '4px',
          display: 'none',
        }}
      />
    </div>
  );
}
