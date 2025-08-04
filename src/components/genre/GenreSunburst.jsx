import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { hierarchy, partition } from 'd3-hierarchy';
import { arc } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const SIZE = 400;
const RADIUS = SIZE / 2;

export default function GenreSunburst({ data }) {
  const ref = useRef(null);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll('*').remove();
    if (!data) return;

    const root = hierarchy(data).sum((d) => d.value || 0);
    partition().size([2 * Math.PI, RADIUS])(root);

    const color = scaleOrdinal(schemeCategory10);
    const arcGen = arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const g = svg
      .attr('viewBox', `${-RADIUS} ${-RADIUS} ${SIZE} ${SIZE}`)
      .append('g');

    g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('d', arcGen)
      .attr('fill', (d) => color(d.ancestors().map((d) => d.data.name).join('-')))
      .on('click', (_event, d) => {
        const leaves = d
          .descendants()
          .filter((n) => !n.children)
          .map((n) => n.data.name);
        setTitles(leaves);
      })
      .append('title')
      .text((d) => d.data.name);
  }, [data]);

  return (
    <div>
      <svg ref={ref} style={{ width: '100%', height: SIZE }} />
      {titles.length > 0 && (
        <ul>
          {titles.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
