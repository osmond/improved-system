import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleOrdinal } from 'd3-scale';
import { Skeleton } from '@/components/ui/skeleton';
import transitions from '@/data/kindle/genre-transitions.json';

export default function GenreSankey() {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setData([]);
    const res = await fetch(
      `/api/kindle/genre-transitions?start=${start}&end=${end}`,
    );
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setData(transitions);
      setLoading(false);
    }, 0);
    return () => clearTimeout(id);
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
    const nodes = genres.map((name) => ({ name }));
    const links = data.map((d) => ({
      source: genres.indexOf(d.source),
      target: genres.indexOf(d.target),
      value: d.count,
    }));

    const { nodes: n, links: l } = sankey()
      .nodeWidth(15)
      .nodePadding(10)
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
    const color = scaleOrdinal().range(chartColors);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    svg
      .append('g')
      .selectAll('path')
      .data(l)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) => color(d.source.name))
      .attr('fill', 'none')
      .attr('stroke-width', (d) => Math.max(1, d.width));

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
    <div>
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
      {loading ? (
        <Skeleton
          className="h-[400px] w-[600px]"
          data-testid="genre-sankey-skeleton"
        />
      ) : (
        <svg ref={svgRef} width="600" height="400" />
      )}
    </div>
  );
}
