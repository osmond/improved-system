import React, { useEffect, useRef, useState, useMemo } from 'react';
import { select } from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { drag } from 'd3-drag';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import graphData from '@/data/kindle/book-graph.json';

export default function BookNetwork({ data = graphData }) {
  const svgRef = useRef(null);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState('');
  const [selected, setSelected] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState(new Set());

  useEffect(() => {
    const degreeMap = {};
    data.links.forEach((l) => {
      degreeMap[l.source] = (degreeMap[l.source] || 0) + 1;
      degreeMap[l.target] = (degreeMap[l.target] || 0) + 1;
    });
    const nodes = data.nodes.map((n) => ({ ...n, degree: degreeMap[n.id] || 0 }));
    setGraph({ nodes, links: data.links });
  }, [data]);

  const adjacency = useMemo(() => {
    const map = new Map();
    graph.links.forEach((l) => {
      if (!map.has(l.source)) map.set(l.source, []);
      if (!map.has(l.target)) map.set(l.target, []);
      map.get(l.source).push(l.target);
      map.get(l.target).push(l.source);
    });
    return map;
  }, [graph]);

  useEffect(() => {
    if (!selected || (!tag && !author)) {
      setHighlightedNodes(new Set(selected ? [selected] : []));
      setHighlightedLinks(new Set());
      return;
    }

    const targets = graph.nodes.filter(
      (n) =>
        (tag && n.tags.includes(tag)) ||
        (author && n.authors.includes(author))
    );

    const prev = {};
    const queue = [selected];
    const visited = new Set([selected]);

    while (queue.length) {
      const node = queue.shift();
      for (const neigh of adjacency.get(node) || []) {
        if (!visited.has(neigh)) {
          visited.add(neigh);
          prev[neigh] = node;
          queue.push(neigh);
        }
      }
    }

    const nodesSet = new Set([selected]);
    const linksSet = new Set();
    const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

    targets.forEach((t) => {
      let curr = t.id;
      if (!prev[curr] && curr !== selected) return;
      nodesSet.add(curr);
      while (curr !== selected) {
        const p = prev[curr];
        nodesSet.add(p);
        linksSet.add(edgeKey(curr, p));
        curr = p;
      }
    });

    setHighlightedNodes(nodesSet);
    setHighlightedLinks(linksSet);
  }, [tag, author, selected, adjacency, graph]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 600;
    const height = 400;

    const chartColors = Array.from(
      { length: 10 },
      (_, i) => `hsl(var(--chart-${i + 1}))`
    );
    const color = scaleOrdinal().range(chartColors);
    const degrees = graph.nodes.map((n) => n.degree);
    const minDegree = Math.min(...degrees);
    const maxDegree = Math.max(...degrees);
    const radiusScale = scaleLinear()
      .domain([minDegree, maxDegree])
      .range([5, 15]);
    const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
    const edgeFromLink = (d) => {
      const s = typeof d.source === 'object' ? d.source.id : d.source;
      const t = typeof d.target === 'object' ? d.target.id : d.target;
      return edgeKey(s, t);
    };

    const simulation = forceSimulation(graph.nodes)
      .force(
        'link',
        forceLink(graph.links).id((d) => d.id).distance(100)
      )
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', 'hsl(var(--chart-2))')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graph.links)
      .join('line')
      .attr('stroke-width', (d) =>
        highlightedLinks.has(edgeFromLink(d)) ? 3 : Math.sqrt(d.weight)
      )
      .attr('stroke', (d) =>
        highlightedLinks.has(edgeFromLink(d))
          ? 'hsl(var(--chart-1))'
          : 'hsl(var(--chart-2))'
      )
      .attr('data-highlighted', (d) =>
        highlightedLinks.has(edgeFromLink(d)) ? 'true' : null
      );

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .join('circle')
      .attr('r', (d) =>
        radiusScale(d.degree) + (highlightedNodes.has(d.id) ? 3 : 0)
      )
      .attr('fill', (d) => color(d.community))
      .attr('stroke', (d) =>
        highlightedNodes.has(d.id)
          ? 'hsl(var(--chart-1))'
          : 'hsl(var(--chart-3))'
      )
      .attr('stroke-width', (d) => (highlightedNodes.has(d.id) ? 3 : 1.5))
      .attr('data-testid', 'node')
      .attr('data-id', (d) => d.id)
      .attr('data-highlighted', (d) =>
        highlightedNodes.has(d.id) ? 'true' : null
      )
      .call(
        drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (event, d) => setSelected(d.id));

    node.append('title').text((d) => d.title);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    return () => simulation.stop();
  }, [graph, highlightedNodes, highlightedLinks]);

  return (
    <div>
      <div>
        <input
          placeholder="Filter by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <input
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
}
