import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';
import transitions from '@/data/kindle/genre-transitions.json';
import { Skeleton } from '@/ui/skeleton';

export default function GenreSankey() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [data, setData] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const fetchData = async () => {
    const res = await fetch(
      `/api/kindle/genre-transitions?start=${start}&end=${end}`,
    );
    const json = await res.json();
    setData(
      json.map((d) => ({
        ...d,
        monthlyCounts: d.monthlyCounts || Array(12).fill(0),
      })),
    );
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setData(
        transitions.map((d) => ({
          ...d,
          monthlyCounts: d.monthlyCounts || Array(12).fill(0),
        })),
      );
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    if (!data || data.length === 0) return;

    const width = 600;
    const height = 400;

    const genres = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));

    // compute totals per genre (incoming + outgoing)
    const totals = data.reduce((acc, { source, target, count }) => {
      acc[source] = (acc[source] || 0) + count;
      acc[target] = (acc[target] || 0) + count;
      return acc;
    }, {});

    // compute outgoing totals separately for percent calculations
    const sourceTotals = data.reduce((acc, { source, count }) => {
      acc[source] = (acc[source] || 0) + count;
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
      value: d.count,
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


    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');

    const values = l.map((d) => d.value).sort((a, b) => a - b);
    const cutoff = values[Math.floor(values.length * 0.95)] || 0;

    const link = svg
      .append('g')
      .selectAll('path')
      .data(l)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .attr('opacity', (d) => (d.value < cutoff ? 0.3 : 1))
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
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        const x = event.pageX || event.clientX;
        const y = event.pageY || event.clientY;
        tooltip.style.display = 'block';
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        const percent = (
          (d.value / (sourceTotals[d.source.name] || d.value)) * 100
        ).toFixed(0);
        const text = `${d.source.name} → ${d.target.name}: ${d.value} sessions (${percent}% of ${d.source.name})`;
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
      .on('mouseout', () => {
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.display = 'none';
      });

    // annotate major flows
    const labelData = l.filter((d) => d.value >= cutoff);
    svg
      .append('g')
      .selectAll('text')
      .data(labelData)
      .join('text')
      .attr('x', (d) => (d.source.x1 + d.target.x0) / 2)
      .attr('y', (d) => d.y0 + (d.y1 - d.y0) / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text((d) => `${d.source.name} → ${d.target.name}: ${d.value}`);

    const node = svg
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
  }, [data]);

  return (
    <div style={{ position: 'relative' }}>
      <div>
        <label>
          Start
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          End
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <button onClick={fetchData}>Apply</button>
      </div>
      {(!data || data.length === 0) ? (
        <Skeleton className="h-64 w-full" data-testid="genre-sankey-skeleton" />
      ) : (
        <svg ref={svgRef} width="600" height="400" />
      )}
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
