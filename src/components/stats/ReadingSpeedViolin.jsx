import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { area, curveCatmullRom } from 'd3-shape';
import { mean, quantile } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import readingSpeed from '@/data/kindle/reading-speed.json';

export const color = {
  morning: 'hsl(var(--chart-5))',
  evening: 'hsl(var(--chart-8))',
};

export default function ReadingSpeedViolin() {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);
  const [bandwidth, setBandwidth] = useState(500);

  useEffect(() => {
    setData(readingSpeed);
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Pre-compute values for each period so scales stay consistent
    const periods = {
      morning: data.filter((d) => d.period === 'morning').map((d) => d.wpm),
      evening: data.filter((d) => d.period === 'evening').map((d) => d.wpm),
    };
    const periodOrder = ['morning', 'evening'];
    const allValues = periodOrder.flatMap((k) => periods[k]);
    if (allValues.length === 0) return;

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const stats = {};
    periodOrder.forEach((period) => {
      const values = periods[period];
      stats[period] = {
        median: quantile(values, 0.5),
        q1: quantile(values, 0.25),
        q3: quantile(values, 0.75),
      };
    });

    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xCat = scaleBand()
      .domain(periodOrder)
      .range([0, innerWidth])
      .paddingInner(0.1);
    const violinWidth = xCat.bandwidth();
    const y = scaleLinear().domain([min, max]).range([innerHeight, 0]);
    const yTicks = y.ticks(40);

    const kernelDensityEstimator = (kernel, X) => (V) =>
      X.map((x) => [x, mean(V, (v) => kernel(x - v))]);
    const kernelEpanechnikov = (k) => (v) => {
      v /= k;
      return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };

    const densities = {};
    let maxDensity = 0;
    periodOrder.forEach((period) => {
      const density = kernelDensityEstimator(
        kernelEpanechnikov(bandwidth),
        yTicks
      )(periods[period]);
      densities[period] = density;
      maxDensity = Math.max(maxDensity, ...density.map((d) => d[1]));
    });

    const x = scaleLinear().domain([0, maxDensity]).range([0, violinWidth / 2]);
    const areaGenerator = area()
      .x0((d) => -x(d[1]))
      .x1((d) => x(d[1]))
      .y((d) => y(d[0]))
      .curve(curveCatmullRom);

    const root = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // axes
    root.append('g').call(axisLeft(y));
    root
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xCat));

    // axis labels
    root
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 20)
      .attr('text-anchor', 'middle')
      .text('Words per Minute');
    root
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Reading Period');

    periodOrder.forEach((period) => {
      const show = period === 'morning' ? showMorning : showEvening;
      const values = periods[period];
      const density = densities[period];
      const center = xCat(period) + violinWidth / 2;
      const g = root
        .append('g')
        .attr('transform', `translate(${center},0)`)
        .style('display', show ? null : 'none');
      const fill = color[period];

      g
        .append('path')
        .datum(density)
        .attr('d', areaGenerator)
        .attr('fill', fill);

      const { q1, q3, median } = stats[period];
      const q1Y = y(q1);
      const q3Y = y(q3);
      const medianY = y(median);
      const boxWidth = x(maxDensity) * 0.3;
      const medianHeight = 10;
      const jitterWidth = x(maxDensity) * 0.3;

      // Interquartile range box
      g
        .append('rect')
        .attr('x', -boxWidth / 2)
        .attr('y', q3Y)
        .attr('width', boxWidth)
        .attr('height', q1Y - q3Y)
        .attr('fill', fill)
        .attr('fill-opacity', 0.4)
        .attr('stroke', fill);

      // Median line
      g
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', medianY - medianHeight / 2)
        .attr('y2', medianY + medianHeight / 2)
        .attr('stroke', fill)
        .attr('stroke-width', 2);

      // Plot individual reading speed points with slight horizontal jitter
      values.forEach((v) => {
        g
          .append('circle')
          .attr('cx', Math.random() * jitterWidth - jitterWidth / 2)
          .attr('cy', y(v))
          .attr('r', 3)
          .attr('fill', fill)
          .attr('fill-opacity', 0.6);
      });
    });
  }, [data, showMorning, showEvening, bandwidth]);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showMorning}
            onChange={(e) => setShowMorning(e.target.checked)}
          />
          Morning
        </label>
        <label>
          <input
            type="checkbox"
            checked={showEvening}
            onChange={(e) => setShowEvening(e.target.checked)}
          />
          Evening
        </label>
      </div>
      <svg ref={svgRef} width="400" height="300" />
      <div>
        <label>
          Bandwidth
          <input
            type="range"
            min="100"
            max="3000"
            step="100"
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
