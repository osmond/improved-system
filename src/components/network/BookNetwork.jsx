import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { drag } from 'd3-drag';
import graphData from '@/data/kindle/book-graph.json';

export default function BookNetwork() {
  const svgRef = useRef(null);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    setGraph(graphData);
  }, []);

  const filteredNodes = graph.nodes.filter(
    (n) =>
      (!tag || n.tags.includes(tag)) && (!author || n.authors.includes(author))
  );
  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredLinks = graph.links.filter(
    (l) => nodeIds.has(l.source) && nodeIds.has(l.target)
  );

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 600;
    const height = 400;

    const simulation = forceSimulation(filteredNodes)
      .force(
        'link',
        forceLink(filteredLinks).id((d) => d.id).distance(100)
      )
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', 'var(--chart-network-link)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.weight));

    const node = svg
      .append('g')
      .attr('stroke', 'var(--chart-network-node-border)')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(filteredNodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', 'var(--chart-network-node)')
      .attr('data-testid', 'node')
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

    return () => simulation.stop();
  }, [filteredNodes, filteredLinks]);

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
