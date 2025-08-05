import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { chord, ribbon } from 'd3-chord';
import { arc } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import graphData from '@/data/kindle/book-graph.json';

function buildMatrix(nodes, links) {
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const size = nodes.length;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  links.forEach((l) => {
    const i = index.get(l.source);
    const j = index.get(l.target);
    if (i != null && j != null) {
      const w = l.weight || 1;
      matrix[i][j] = w;
      matrix[j][i] = w;
    }
  });
  return matrix;
}

export default function BookChordDiagram({ data = graphData }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 600;
    const height = 400;
    const outerRadius = Math.min(width, height) / 2 - 30;
    const innerRadius = outerRadius - 20;

    const matrix = buildMatrix(data.nodes, data.links);
    const chords = chord().padAngle(0.05)(matrix);
    const chartColors = Array.from(
      { length: 10 },
      (_, i) => `hsl(var(--chart-${i + 1}))`
    );
    const color = scaleOrdinal().range(chartColors);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    g.append('g')
      .selectAll('path')
      .data(chords.groups)
      .join('path')
      .attr('fill', (d) => color(d.index))
      .attr('stroke', (d) => color(d.index))
      .attr('d', arc().innerRadius(innerRadius).outerRadius(outerRadius));

    g.append('g')
      .selectAll('path')
      .data(chords)
      .join('path')
      .attr('fill', (d) => color(d.target.index))
      .attr('stroke', (d) => color(d.target.index))
      .attr('d', ribbon().radius(innerRadius))
      .attr('opacity', 0.7)
      .attr('data-testid', 'chord');
  }, [data]);

  return <svg ref={svgRef} width={600} height={400}></svg>;
}

