import React, { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force';
import { drag } from 'd3-drag';
import graphData from '@/data/kindle/book-graph.json';

// Breadth first search returning path from start to target
function bfs(start, target, adj) {
  if (start === target) return [start];
  const visited = new Set([start]);
  const queue = [[start]];
  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];
    for (const neigh of adj.get(node) || []) {
      if (!visited.has(neigh)) {
        const newPath = [...path, neigh];
        if (neigh === target) return newPath;
        visited.add(neigh);
        queue.push(newPath);
      }
    }
  }
  return null;
}

export default function BookNetwork() {
  const svgRef = useRef(null);
  const nodeSel = useRef(null);
  const linkSel = useRef(null);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setGraph(graphData);
  }, []);

  // Build adjacency map from links
  const adjacency = useMemo(() => {
    const map = new Map();
    graph.links.forEach((l) => {
      if (!map.has(l.source)) map.set(l.source, new Set());
      if (!map.has(l.target)) map.set(l.target, new Set());
      map.get(l.source).add(l.target);
      map.get(l.target).add(l.source);
    });
    return map;
  }, [graph.links]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 600;
    const height = 400;

    const simulation = forceSimulation(graph.nodes)
      .force('link', forceLink(graph.links).id((d) => d.id).distance(100))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', 'var(--chart-network-link)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graph.links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.weight))
      .attr('data-id', (d) => `${d.source}-${d.target}`);

    const node = svg
      .append('g')
      .attr('stroke', 'var(--chart-network-node-border)')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(graph.nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', 'var(--chart-network-node)')
      .attr('data-testid', 'node')
      .attr('data-id', (d) => d.id)
      .on('click', (_, d) => setSelected(d.id))
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
      );

    node.append('title').text((d) => d.title);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    nodeSel.current = node;
    linkSel.current = link;

    return () => simulation.stop();
  }, [graph]);

  // Highlight shortest paths from selected node to search results
  useEffect(() => {
    if (!nodeSel.current || !linkSel.current) return;

    // reset styles
    nodeSel.current
      .attr('stroke', 'var(--chart-network-node-border)')
      .attr('stroke-width', 1.5);
    linkSel.current
      .attr('stroke', 'var(--chart-network-link)')
      .attr('stroke-width', (d) => Math.sqrt(d.weight));

    if (!selected || (!tag && !author)) return;

    const targets = graph.nodes
      .filter(
        (n) =>
          (tag && n.tags.includes(tag)) || (author && n.authors.includes(author))
      )
      .map((n) => n.id);

    const highlightNodes = new Set([selected]);
    const highlightLinks = new Set();

    targets.forEach((t) => {
      const path = bfs(selected, t, adjacency);
      if (path) {
        path.forEach((p) => highlightNodes.add(p));
        for (let i = 0; i < path.length - 1; i++) {
          highlightLinks.add(`${path[i]}|${path[i + 1]}`);
        }
      }
    });

    nodeSel.current
      .filter((d) => highlightNodes.has(d.id))
      .attr('stroke', 'orange')
      .attr('stroke-width', 3);

    linkSel.current
      .filter((d) => {
        const s = typeof d.source === 'object' ? d.source.id : d.source;
        const t = typeof d.target === 'object' ? d.target.id : d.target;
        return (
          highlightLinks.has(`${s}|${t}`) || highlightLinks.has(`${t}|${s}`)
        );
      })
      .attr('stroke', 'orange')
      .attr('stroke-width', 3);
  }, [tag, author, selected, adjacency, graph.nodes]);

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

