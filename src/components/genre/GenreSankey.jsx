import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleOrdinal } from 'd3-scale';
import transitions from '@/data/kindle/genre-transitions.json';

export default function GenreSankey() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [data, setData] = useState([]);
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
    setData(
      transitions.map((d) => ({
        ...d,
        monthlyCounts: d.monthlyCounts || Array(12).fill(0),
      })),
    );
  }, []);

  useEffect(() => {
    if (start && end) fetchData();
  }, [start, end]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    if (!data || data.length === 0) return;

    const width = 600;
    const height = 400;

    const genres = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));

    // compute outgoing totals per genre
    const outflows = {};
    data.forEach((d) => {
      outflows[d.source] = (outflows[d.source] || 0) + d.count;
      if (!(d.target in outflows)) outflows[d.target] = outflows[d.target] || 0;
    });

    // sort genres by descending outflow
    const sortedGenres = [...genres].sort(
      (a, b) => (outflows[b] || 0) - (outflows[a] || 0),
    );

    const nodes = sortedGenres.map((name) => ({
      name,
      outflow: outflows[name] || 0,
    }));
    const links = data.map((d) => ({
      source: sortedGenres.indexOf(d.source),
      target: sortedGenres.indexOf(d.target),
      value: d.count,
      monthlyCounts: d.monthlyCounts || Array(12).fill(0),
    }));

    const { nodes: n, links: l } = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .nodeSort((a, b) => b.outflow - a.outflow)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ])({
        nodes: nodes.map((d) => ({ ...d })),
        links: links.map((d) => ({ ...d })),
      });

    const chartColors = Array.from(
      { length: 10 },
      (_, i) => `hsl(var(--chart-${i + 1}))`
    );
    // reuse a single ordinal scale so nodes and their outgoing links share hues
    const color = scaleOrdinal().domain(sortedGenres).range(chartColors);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    svg
      .append('g')
      .selectAll('path')
      .data(l)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) => color(d.source.name))
      .attr('fill', 'none')
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        const x = event.pageX || event.clientX;
        const y = event.pageY || event.clientY;
        tooltip.style.display = 'block';
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        const text = `${d.source.name} → ${d.target.name}: ${d.value} sessions`;
        const counts = d.monthlyCounts || [];
        const max = Math.max(...counts, 0);
        const barWidth = 5;
        const barHeight = 20;
        const bars = counts
          .map((c, i) => {
            const h = max ? (c / max) * barHeight : 0;
            return `<rect x="${i * barWidth}" y="${barHeight - h}" width="${barWidth - 1}" height="${h}" fill="steelblue" />`;
          })
          .join('');
        tooltip.innerHTML = `<div>${text}</div><svg width="${counts.length * barWidth}" height="${barHeight}">${bars}</svg>`;
      })
      .on('mouseout', () => {
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.display = 'none';
      });

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
      .attr('fill', (d) => color(d.name));

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
      <svg ref={svgRef} width="600" height="400" />
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
