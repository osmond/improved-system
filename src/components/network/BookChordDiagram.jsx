import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { chord, ribbon } from 'd3-chord';
import { arc } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import graphData from '@/data/kindle/book-graph.json';
import buildChordMatrix from '@/services/chordMatrix.js';

export default function BookChordDiagram({ data = graphData }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 600;
    const height = 400;
    const outerRadius = Math.min(width, height) / 2 - 30;
    const innerRadius = outerRadius - 20;

    const matrix = buildChordMatrix(data.nodes, data.links);
    const chords = chord().padAngle(0.05)(matrix);
    const chartColors = Array.from(
      { length: 10 },
      (_, i) => `hsl(var(--chart-${i + 1}))`
    );
    const color = scaleOrdinal().range(chartColors);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const group = g
      .append('g')
      .selectAll('g')
      .data(chords.groups)
      .join('g');

    group
      .append('path')
      .attr('fill', (d) => color(d.index))
      .attr('stroke', (d) => color(d.index))
      .attr('d', arc().innerRadius(innerRadius).outerRadius(outerRadius));

    group
      .append('text')
      .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr('dy', '.35em')
      .attr(
        'transform',
        (d) =>
          `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${
            outerRadius + 5
          }) ${d.angle > Math.PI ? 'rotate(180)' : ''}`
      )
      .attr('text-anchor', (d) => (d.angle > Math.PI ? 'end' : 'start'))
      .text(
        (d) => data.nodes[d.index].title || data.nodes[d.index].id || ''
      )
      .attr('data-testid', 'label');

    const chordPaths = g
      .append('g')
      .selectAll('path')
      .data(chords)
      .join('path')
      .attr('fill', (d) => color(d.target.index))
      .attr('stroke', (d) => color(d.target.index))
      .attr('d', ribbon().radius(innerRadius))
      .attr('opacity', 0.7)
      .attr('data-testid', 'chord');

    chordPaths
      .append('title')
      .text(
        (d) =>
          `${
            data.nodes[d.source.index].title ||
            data.nodes[d.source.index].id ||
            ''
          } → ${
            data.nodes[d.target.index].title ||
            data.nodes[d.target.index].id ||
            ''
          }`
      );
  }, [data]);

  return <svg ref={svgRef} width={600} height={400}></svg>;
}

