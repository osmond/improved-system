import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import readingSpeed from '@/data/kindle/reading-speed.json';

export default function ReadingSpeedViolin() {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);

  useEffect(() => {
    setData(readingSpeed);
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Group values by period according to visibility toggles
    const periods = {};
    if (showMorning) periods.morning = data.filter((d) => d.period === 'morning').map((d) => d.wpm);
    if (showEvening) periods.evening = data.filter((d) => d.period === 'evening').map((d) => d.wpm);
    const periodKeys = Object.keys(periods);
    if (periodKeys.length === 0) return;

    // Helpers for quantile calculations
    const quantile = (arr, q) => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      return sorted[base + 1] !== undefined
        ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
        : sorted[base];
    };

    // Compute global min/max and stats per period
    const allValues = periodKeys.flatMap((k) => periods[k]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bins = 20;
    const binSize = (max - min) / bins;

    const countsByPeriod = {};
    const stats = {};
    let maxCount = 0;
    periodKeys.forEach((period) => {
      const values = periods[period];
      const counts = new Array(bins).fill(0);
      values.forEach((v) => {
        const idx = Math.min(bins - 1, Math.floor((v - min) / binSize));
        counts[idx] += 1;
      });
      countsByPeriod[period] = counts;
      maxCount = Math.max(maxCount, ...counts);

      stats[period] = {
        median: quantile(values, 0.5),
        q1: quantile(values, 0.25),
        q3: quantile(values, 0.75),
      };
    });

    const width = 400;
    const height = 300;
    const violinWidth = width / periodKeys.length;
    const x = scaleLinear().domain([0, maxCount]).range([0, violinWidth / 2]);
    const y = scaleLinear().domain([min, max]).range([height, 0]);

    const root = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g');

    periodKeys.forEach((period, i) => {
      const counts = countsByPeriod[period];
      const center = violinWidth * (i + 0.5);
      const g = root.append('g').attr('transform', `translate(${center},0)`);
      counts.forEach((c, j) => {
        const y0 = y(min + j * binSize);
        const y1 = y(min + (j + 1) * binSize);
        const w = x(c);
        g
          .append('rect')
          .attr('x', -w)
          .attr('y', y1)
          .attr('width', w * 2)
          .attr('height', y0 - y1)
          .attr('fill', 'var(--chart-network-node)');
      });

      const { q1, q3, median } = stats[period];
      const q1Y = y(q1);
      const q3Y = y(q3);
      const medianY = y(median);
      const boxWidth = x(maxCount) * 0.3;
      const medianHeight = 10;

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
    });
  }, [data, showMorning, showEvening]);

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
    </div>
  );
}
