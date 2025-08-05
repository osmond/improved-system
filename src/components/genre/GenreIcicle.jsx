import React, { useCallback, useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { hierarchy, partition } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { hsl } from 'd3-color';
import { interpolate } from 'd3-interpolate';
import 'd3-transition';
import { Skeleton } from '@/ui/skeleton';

const WIDTH = 600;
const HEIGHT = 400;
const LABEL_MIN_HEIGHT = 20; // min height to show vertical label

export default function GenreIcicle({ data }) {
  const ref = useRef(null);
  const [currentNode, setCurrentNode] = useState(null);
  const xScale = useRef(scaleLinear().range([0, WIDTH]).domain([0, WIDTH]));
  const yScale = useRef(scaleLinear().range([0, HEIGHT]).domain([0, HEIGHT]));

  const computeTextTransform = useCallback(
    (d) => {
      const x = (xScale.current(d.x0) + xScale.current(d.x1)) / 2;
      const y = (yScale.current(d.y0) + yScale.current(d.y1)) / 2;
      return `translate(${x},${y}) rotate(90)`;
    },
    []
  );

  const updateGhosting = useCallback((node) => {
    const ancestors = node.ancestors();
    const svg = select(ref.current);
    svg
      .selectAll('rect, text')
      .style('opacity', (d) => (ancestors.includes(d) && d !== node ? 0.3 : 1));
  }, []);

  const zoomTo = useCallback(
    (node) => {
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
      t
        .selectAll('rect')
        .attr('x', (d) => xScale.current(d.x0))
        .attr('y', (d) => yScale.current(d.y0))
        .attr('width', (d) => xScale.current(d.x1) - xScale.current(d.x0))
        .attr('height', (d) => yScale.current(d.y1) - yScale.current(d.y0));
      t
        .selectAll('text')
        .attrTween('transform', (d) => () => computeTextTransform(d))
        .styleTween('opacity', (d) => () =>
          yScale.current(d.y1) - yScale.current(d.y0) > LABEL_MIN_HEIGHT ? 1 : 0
        );
      t.on('end', () => updateGhosting(node));
    },
    [computeTextTransform, updateGhosting]
  );

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!data) return;

    const root = hierarchy(data).sum((d) => d.value || 0);
    partition().size([WIDTH, HEIGHT])(root);
    setCurrentNode(root);

    const style = getComputedStyle(document.documentElement);
    const chartColors = Array.from({ length: 10 }, (_, i) => {
      const val = style
        .getPropertyValue(`--chart-${i + 1}`)
        .trim()
        .replace(/\s+/g, ',');
      return `hsl(${val})`;
    });
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

    const nodes = root.descendants().filter((d) => d.depth);

    g.selectAll('rect')
      .data(nodes)
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

    g.selectAll('text')
      .data(nodes)
      .join('text')
      .attr('transform', (d) => computeTextTransform(d))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.32em')
      .style('pointer-events', 'none')
      .style('opacity', (d) =>
        yScale.current(d.y1) - yScale.current(d.y0) > LABEL_MIN_HEIGHT ? 1 : 0
      )
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .text((d) => d.data.name);

    updateGhosting(root);
  }, [data, zoomTo]);

  if (!data) {
    return (
      <Skeleton
        className="h-[400px] w-full"
        data-testid="genre-icicle-skeleton"
      />
    );
  }

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
