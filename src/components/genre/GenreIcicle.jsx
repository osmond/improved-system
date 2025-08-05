import React, { useCallback, useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { hierarchy, partition } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { hsl } from 'd3-color';
import { interpolate } from 'd3-interpolate';
import 'd3-transition';

const WIDTH = 600;
const HEIGHT = 400;

export default function GenreIcicle({ data }) {
  const ref = useRef(null);
  const [currentNode, setCurrentNode] = useState(null);
  const xScale = useRef(scaleLinear().range([0, WIDTH]).domain([0, WIDTH]));
  const yScale = useRef(scaleLinear().range([0, HEIGHT]).domain([0, HEIGHT]));

  const zoomTo = useCallback((node) => {
    const svg = select(ref.current);
    const t = svg.transition().duration(750);
    t.tween('scale', () => {
      const xd = interpolate(xScale.current.domain(), [node.x0, node.x1]);
      const yd = interpolate(yScale.current.domain(), [node.y0, HEIGHT]);
      return (t) => {
        xScale.current.domain(xd(t));
        yScale.current.domain(yd(t));
      };
    });
    t.selectAll('rect')
      .attr('x', (d) => xScale.current(d.x0))
      .attr('y', (d) => yScale.current(d.y0))
      .attr('width', (d) => xScale.current(d.x1) - xScale.current(d.x0))
      .attr('height', (d) => yScale.current(d.y1) - yScale.current(d.y0));
  }, []);

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!data) return;

    const root = hierarchy(data).sum((d) => d.value || 0);
    partition().size([WIDTH, HEIGHT])(root);
    setCurrentNode(root);

    const style = getComputedStyle(document.documentElement);
    const chartColors = Array.from({ length: 10 }, (_, i) =>
      `hsl(${style
        .getPropertyValue(`--chart-${i + 1}`)
        .trim()
        .replace(/\s+/g, ',')})`
    );
    const color = scaleOrdinal().range(chartColors);

    const getColor = (d) => {
      if (d.color) return d.color;
      const top = d.ancestors().find((a) => a.depth === 1) || d;
      const base = hsl(color(top.data.name));
      const depth = d.depth - 1;
      base.s = Math.max(0, base.s - depth * 0.15);
      base.l = Math.min(1, base.l + depth * 0.1);
      d.color = base.toString();
      return d.color;
    };

    const g = svg
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
      .append('g');

    g.selectAll('rect')
      .data(root.descendants().filter((d) => d.depth))
      .join('rect')
      .attr('x', (d) => xScale.current(d.x0))
      .attr('y', (d) => yScale.current(d.y0))
      .attr('width', (d) => xScale.current(d.x1) - xScale.current(d.x0))
      .attr('height', (d) => yScale.current(d.y1) - yScale.current(d.y0))
      .attr('data-name', (d) => d.data.name)
      .attr('fill', (d) => getColor(d))
      .on('mouseover', function (_event, d) {
        select(this).attr('fill', getColor(d));
      })
      .on('mouseout', function (_event, d) {
        select(this).attr('fill', getColor(d));
      })
      .on('click', (_event, d) => {
        setCurrentNode(d);
        zoomTo(d);
      })
      .append('title')
      .text((d) => d.data.name);
  }, [data, zoomTo]);

  const ancestors = currentNode ? currentNode.ancestors().reverse() : [];

  return (
    <div>
      <div>
        {ancestors.map((node, i) => (
          <span key={node.data.name}>
            {i > 0 && ' / '}
            <button
              type="button"
              onClick={() => {
                setCurrentNode(node);
                zoomTo(node);
              }}
            >
              {node.data.name}
            </button>
          </span>
        ))}
      </div>
      <svg ref={ref} style={{ width: '100%', height: HEIGHT }} />
    </div>
  );
}
