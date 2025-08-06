import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { area, curveCatmullRom } from 'd3-shape';
import { mean, quantile } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';

export const color = {
  morning: 'hsl(var(--chart-5))',
  evening: 'hsl(var(--chart-8))',
};

export default function ReadingSpeedViolin() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 450 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);
  const [bandwidth, setBandwidth] = useState(300);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const width = entry.contentRect.width;
        if (width > 0) {
          const height = width * 0.64;
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/kindle/reading-speed');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        try {
          const local = await import('@/data/kindle/reading-speed.json');
          setData(local.default);
        } catch {
          setError('Error loading reading speed data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    if (!width || !height) return;

    // Pre-compute values for each period so scales stay consistent
    const periods = {
      morning: data.filter((d) => d.period === 'morning'),
      evening: data.filter((d) => d.period === 'evening'),
    };
    const periodOrder = ['morning', 'evening'];
    const allValues = periodOrder.flatMap((k) => periods[k].map((d) => d.wpm));
    if (allValues.length === 0) return;

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const stats = {};
    periodOrder.forEach((period) => {
      const values = periods[period].map((d) => d.wpm);
      const q1 = quantile(values, 0.25);
      const q3 = quantile(values, 0.75);
      const median = quantile(values, 0.5);
      const iqr = q3 - q1;
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const lowerWhisker = Math.max(minVal, q1 - 1.5 * iqr);
      const upperWhisker = Math.min(maxVal, q3 + 1.5 * iqr);
      stats[period] = {
        median,
        q1,
        q3,
        lowerWhisker,
        upperWhisker,
      };
    });

    const isSmall = width < 600;
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
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
      )(periods[period].map((d) => d.wpm));
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

      if (!isSmall) {
        g
          .append('path')
          .datum(density)
          .attr('d', areaGenerator)
          .attr('fill', fill);
      }

      const { q1, q3, median, lowerWhisker, upperWhisker } = stats[period];
      const q1Y = y(q1);
      const q3Y = y(q3);
      const medianY = y(median);
      const lowerWhiskerY = y(lowerWhisker);
      const upperWhiskerY = y(upperWhisker);
      const boxWidth = violinWidth;
      const lineX1 = -violinWidth / 2;
      const lineX2 = violinWidth / 2;
      const jitterWidth = isSmall ? violinWidth * 0.1 : x(maxDensity) * 0.3;

      // Interquartile range box
      g
        .append('rect')
        .attr('x', lineX1)
        .attr('y', q3Y)
        .attr('width', boxWidth)
        .attr('height', q1Y - q3Y)
        .attr('fill', fill)
        .attr('fill-opacity', 0.4)
        .attr('stroke', fill)
        .attr('stroke-width', 2);

      // Median line
      g
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y1', medianY)
        .attr('y2', medianY)
        .attr('stroke', fill)
        .attr('stroke-width', 2);

      // Whisker lines
      g
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y1', upperWhiskerY)
        .attr('y2', upperWhiskerY)
        .attr('stroke', fill)
        .attr('stroke-width', 2);

      g
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y1', lowerWhiskerY)
        .attr('y2', lowerWhiskerY)
        .attr('stroke', fill)
        .attr('stroke-width', 2);

      // Plot individual reading speed points with slight horizontal jitter
      const tooltip = select(tooltipRef.current);
      values.forEach((v) => {
        g
          .append('circle')
          .attr('cx', Math.random() * jitterWidth - jitterWidth / 2)
          .attr('cy', y(v.wpm))
          .attr('r', 3)
          .attr('fill', fill)
          .attr('fill-opacity', 0.6)
          .on('mouseover', (event) => {
            const rect = svgRef.current.getBoundingClientRect();
            tooltip
              .style('opacity', 1)
              .html(
                `WPM: ${v.wpm}<br/>${new Date(v.start).toLocaleString()}`
              )
              .style('left', event.clientX - rect.left + 10 + 'px')
              .style('top', event.clientY - rect.top + 10 + 'px');
          })
          .on('mousemove', (event) => {
            const rect = svgRef.current.getBoundingClientRect();
            tooltip
              .style('left', event.clientX - rect.left + 10 + 'px')
              .style('top', event.clientY - rect.top + 10 + 'px');
          })
          .on('mouseout', () => tooltip.style('opacity', 0));
      });
    });
  }, [data, showMorning, showEvening, bandwidth, dimensions]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading reading speed data...</p>}
      {error && !loading && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p>No reading speed data available.</p>
      )}
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
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          background: 'white',
          border: '1px solid #ccc',
          padding: '4px',
          borderRadius: '4px',
        }}
      />
      <div>
        <label>
          Smoothing
          <select
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
          >
            <option value={100}>Low</option>
            <option value={300}>Medium</option>
            <option value={600}>High</option>
          </select>
        </label>
      </div>
    </div>
  );
}
