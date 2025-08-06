import React, { useEffect, useRef, useState } from 'react';
import { select, pointer } from 'd3-selection';
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
  const presets = {
    deep: [0, 200],
    normal: [200, 400],
    skimming: [400, Infinity],
  };
  const [preset, setPreset] = useState('all');
  const [chartType, setChartType] = useState('violin');

  const filteredData = React.useMemo(() => {
    if (preset === 'all') return data;
    const [min, max] = presets[preset];
    return data.filter((d) => d.wpm >= min && d.wpm < max);
  }, [data, preset]);

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

    const periods = {
      morning: filteredData.filter((d) => d.period === 'morning'),
      evening: filteredData.filter((d) => d.period === 'evening'),
    };
    const periodOrder = ['morning', 'evening'];
    const allValues = periodOrder.flatMap((k) => periods[k].map((d) => d.wpm));
    if (allValues.length === 0) return;

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const stats = {};
    periodOrder.forEach((period) => {
      const values = periods[period].map((d) => d.wpm);
      if (values.length === 0) return;
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
    const catWidth = xCat.bandwidth();
    const y = scaleLinear().domain([min, max]).range([innerHeight, 0]);

    let densities = {};
    let maxDensity = 0;
    let x;
    let areaGenerator;
    if (chartType === 'violin') {
      const yTicks = y.ticks(40);
      const kernelDensityEstimator = (kernel, X) => (V) =>
        X.map((x) => [x, mean(V, (v) => kernel(x - v))]);
      const kernelEpanechnikov = (k) => (v) => {
        v /= k;
        return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };

      periodOrder.forEach((period) => {
        const values = periods[period].map((d) => d.wpm);
        if (values.length === 0) return;
        const density = kernelDensityEstimator(
          kernelEpanechnikov(bandwidth),
          yTicks
        )(values);
        densities[period] = density;
        maxDensity = Math.max(maxDensity, ...density.map((d) => d[1]));
      });

      x = scaleLinear().domain([0, maxDensity]).range([0, catWidth / 2]);
      areaGenerator = area()
        .x0((d) => -x(d[1]))
        .x1((d) => x(d[1]))
        .y((d) => y(d[0]))
        .curve(curveCatmullRom);
    }

    const root = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    root.append('g').call(axisLeft(y));
    root
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xCat));

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

    const jitterWidth = isSmall
      ? catWidth * 0.1
      : chartType === 'violin' && x
      ? x(maxDensity) * 0.3
      : catWidth * 0.3;

    const legendData = [
      { key: 'morning', label: 'Morning', visible: showMorning },
      { key: 'evening', label: 'Evening', visible: showEvening },
    ];

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${width - margin.right - 100},${margin.top})`
      );

    const legendItems = legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(0, ${i * 20})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        if (d.key === 'morning') {
          setShowMorning((s) => !s);
        } else {
          setShowEvening((s) => !s);
        }
      });

    legendItems
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', (d) => color[d.key])
      .attr('fill-opacity', (d) => (d.visible ? 1 : 0.3))
      .attr('stroke', (d) => color[d.key]);

    legendItems
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .text((d) => d.label)
      .attr('fill', '#000');

    periodOrder.forEach((period) => {
      const show = period === 'morning' ? showMorning : showEvening;
      const values = periods[period];
      if (values.length === 0) return;
      const center = xCat(period) + catWidth / 2;
      const g = root
        .append('g')
        .attr('transform', `translate(${center},0)`)
        .style('display', show ? null : 'none');
      const fill = color[period];
      const tooltip = select(tooltipRef.current);

      if (chartType === 'violin' && !isSmall) {
        const density = densities[period];
        g
          .append('path')
          .datum(density)
          .attr('d', areaGenerator)
          .attr('fill', fill)
          .on('mousemove', (event) => {
            const [, yPos] = pointer(event);
            const wpmVal = y.invert(yPos);
            const nearest = density.reduce((a, b) =>
              Math.abs(b[0] - wpmVal) < Math.abs(a[0] - wpmVal) ? b : a
            );
            const rect = svgRef.current.getBoundingClientRect();
            tooltip
              .style('opacity', 1)
              .html(
                `WPM: ${wpmVal.toFixed(0)}<br/>Density: ${nearest[1].toFixed(3)}`
              )
              .style('left', event.clientX - rect.left + 10 + 'px')
              .style('top', event.clientY - rect.top + 10 + 'px');
          })
          .on('mouseout', () => tooltip.style('opacity', 0));
      }

      if (chartType === 'violin' || chartType === 'box') {
        const { q1, q3, median, lowerWhisker, upperWhisker } = stats[period];
        const q1Y = y(q1);
        const q3Y = y(q3);
        const medianY = y(median);
        const lowerWhiskerY = y(lowerWhisker);
        const upperWhiskerY = y(upperWhisker);
        const boxWidth = catWidth;
        const lineX1 = -catWidth / 2;
        const lineX2 = catWidth / 2;

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

        g
          .append('line')
          .attr('x1', lineX1)
          .attr('x2', lineX2)
          .attr('y1', medianY)
          .attr('y2', medianY)
          .attr('stroke', fill)
          .attr('stroke-width', 2);

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
      }

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
            const meta = Object.entries(v)
              .filter(([k]) => !['wpm', 'start', 'period'].includes(k))
              .map(
                ([k, val]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${val}`
              )
              .join('<br/>');
            tooltip
              .style('opacity', 1)
              .html(
                `WPM: ${v.wpm}<br/>${new Date(v.start).toLocaleString()}${
                  meta ? '<br/>' + meta : ''
                }`
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
  }, [
    filteredData,
    showMorning,
    showEvening,
    bandwidth,
    dimensions,
    chartType,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading reading speed data...</p>}
      {error && !loading && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p>No reading speed data available.</p>
      )}
      <div>
        <button onClick={() => setPreset('all')}>Show All</button>
        <button onClick={() => setPreset('deep')}>Deep reading (0-200 WPM)</button>
        <button onClick={() => setPreset('normal')}>Normal (200-400 WPM)</button>
        <button onClick={() => setPreset('skimming')}>Skimming (400+ WPM)</button>
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
          background: 'rgba(255,255,255,0.9)',
          color: '#000',
          border: '1px solid #ccc',
          padding: '4px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
      <div>
        <label>
          Chart Type
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="violin">Violin</option>
            <option value="box">Box Plot</option>
          </select>
        </label>
      </div>
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
