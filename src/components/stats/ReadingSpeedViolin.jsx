import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { area, curveCatmullRom } from 'd3-shape';
import { mean, quantile } from 'd3-array';
import readingSpeed from '@/data/kindle/reading-speed.json';

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
    const violinWidth = width / periodOrder.length;
    const y = scaleLinear().domain([min, max]).range([height, 0]);
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

    const root = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g');

    periodOrder.forEach((period, i) => {
      const show = period === 'morning' ? showMorning : showEvening;
      const values = periods[period];
      const density = densities[period];
      const center = violinWidth * (i + 0.5);
      const g = root
        .append('g')
        .attr('transform', `translate(${center},0)`)
        .style('display', show ? null : 'none');

      g
        .append('path')
        .datum(density)
        .attr('d', areaGenerator)
        .attr('fill', 'var(--chart-network-node)');

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
        .attr('fill', 'var(--chart-network-node-border)')
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'var(--chart-network-node-border)');

      // Median line
      g
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', medianY - medianHeight / 2)
        .attr('y2', medianY + medianHeight / 2)
        .attr('stroke', 'var(--chart-network-node-border)')
        .attr('stroke-width', 2);

      // Plot individual reading speed points with slight horizontal jitter
      values.forEach((v) => {
        g
          .append('circle')
          .attr('cx', Math.random() * jitterWidth - jitterWidth / 2)
          .attr('cy', y(v))
          .attr('r', 3)
          .attr('fill', 'var(--chart-network-node-border)')
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
