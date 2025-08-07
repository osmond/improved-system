import React, { useEffect, useRef, useState } from 'react';
import { select, pointer } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { area, curveCatmullRom } from 'd3-shape';
import { mean, quantile } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

const okabeIto = {
  blue: '#0072B2',
  vermillion: '#D55E00',
};

export const color = {
  morning: okabeIto.blue,
  evening: okabeIto.vermillion,
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
  const [showOutliers, setShowOutliers] = useState(false);
  const [bandwidth, setBandwidth] = useState(300);
  const presets = {
    deep: [0, 200],
    normal: [200, 400],
    skimming: [400, Infinity],
  };
  const [preset, setPreset] = useState('all');

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
    const yDomain = showOutliers ? [min, max] : [0, 600];
    const y = scaleLinear().domain(yDomain).range([innerHeight, 0]);

    let densities = {};
    let maxDensity = 0;
    const yTicksDensity = y.ticks(40);
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
        yTicksDensity,
      )(values);
      densities[period] = density;
      maxDensity = Math.max(maxDensity, ...density.map((d) => d[1]));
    });

    const x = scaleLinear().domain([0, maxDensity]).range([0, catWidth / 2]);
    const areaGenerator = area()
      .x0((d) => -x(d[1]))
      .x1((d) => x(d[1]))
      .y((d) => y(d[0]))
      .curve(curveCatmullRom);

    const root = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#555');

    const yTicks = y.ticks();
    const majorTicks = yTicks.filter((d) => d % 250 === 0);

    const grid = root
      .append('g')
      .attr('class', 'grid')
      .call(
        axisLeft(y)
          .tickValues(yTicks)
          .tickSize(-innerWidth)
          .tickFormat('')
      );

    grid
      .selectAll('line')
      .attr('stroke', (d) => (majorTicks.includes(d) ? '#555' : '#777'));
    grid.select('.domain').remove();

    const yAxisGroup = root
      .append('g')
      .attr('class', 'y-axis')
      .call(axisLeft(y).tickValues(majorTicks));

    yAxisGroup.selectAll('.tick line').attr('stroke', '#555').attr('stroke-width', 1);
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#333')
      .style('font-weight', 'bold');
    yAxisGroup.select('.domain').remove();

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

    periodOrder.forEach((period) => {
      const show = period === 'morning' ? showMorning : showEvening;
      const values = periods[period];
      if (values.length === 0) return;
      const center = xCat(period) + catWidth / 2;

      root
        .append('text')
        .attr('x', center)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', color[period])
        .attr('role', 'checkbox')
        .attr('tabindex', 0)
        .attr('aria-label', period === 'morning' ? 'Morning' : 'Evening')
        .attr('aria-checked', show ? 'true' : 'false')
        .style('cursor', 'pointer')
        .style('font-weight', 'bold')
        .style('opacity', show ? 1 : 0.3)
        .text(period === 'morning' ? 'Morning' : 'Evening')
        .on('click', () => {
          if (period === 'morning') {
            setShowMorning((s) => !s);
          } else {
            setShowEvening((s) => !s);
          }
        })
        .on('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (period === 'morning') {
              setShowMorning((s) => !s);
            } else {
              setShowEvening((s) => !s);
            }
          }
        });

      const g = root
        .append('g')
        .attr('transform', `translate(${center},0)`)
        .style('display', show ? null : 'none');
      const fill = color[period];
      const tooltip = select(tooltipRef.current);

      if (!isSmall) {
        const density = densities[period];
        g
          .append('path')
          .datum(density)
          .attr('d', areaGenerator)
          .attr('fill', fill)
          .attr('fill-opacity', 0.3)
          .attr('stroke', fill)
          .attr('stroke-width', 1)
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

      const { q1, q3, median } = stats[period];
      const q1Y = y(q1);
      const q3Y = y(q3);
      const medianY = y(median);
      const lineX1 = -catWidth / 2;
      const lineX2 = catWidth / 2;
      const tickWidth = catWidth * 0.3;
      const tickX1 = -tickWidth / 2;
      const tickX2 = tickWidth / 2;

      g
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y1', medianY)
        .attr('y2', medianY)
        .attr('stroke', fill)
        .attr('stroke-width', 4);

      g
        .append('line')
        .attr('x1', tickX1)
        .attr('x2', tickX2)
        .attr('y1', q1Y)
        .attr('y2', q1Y)
        .attr('stroke', fill)
        .attr('stroke-width', 1.5);

      g
        .append('line')
        .attr('x1', tickX1)
        .attr('x2', tickX2)
        .attr('y1', q3Y)
        .attr('y2', q3Y)
        .attr('stroke', fill)
        .attr('stroke-width', 1.5);

      const maxPoints = 300;
      const step = Math.ceil(values.length / maxPoints);
      const sampled = step > 1 ? values.filter((_, i) => i % step === 0) : values;

      const nodes = sampled.map((v) => ({ data: v, x: 0, y: y(v.wpm) }));

      const rand = (() => {
        let seed = 42;
        return () => {
          seed = (seed * 16807) % 2147483647;
          return (seed - 1) / 2147483646;
        };
      })();

      const simulation = forceSimulation(nodes)
        .force('x', forceX(0))
        .force('y', forceY((d) => d.y).strength(1))
        .force('collide', forceCollide(2.5))
        .randomSource(rand)
        .stop();

      for (let i = 0; i < 200; i += 1) simulation.tick();

      nodes.forEach((n) => {
        const v = n.data;
        g
          .append('circle')
          .attr('cx', n.x)
          .attr('cy', n.y)
          .attr('r', 2)
          .attr('fill', fill)
          .attr('fill-opacity', 0.25)
          .attr('stroke', '#333')
          .attr('stroke-width', 0.5)
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
    showOutliers,
  ]);

  const {
    morningMedian,
    eveningMedian,
    morningCount,
    eveningCount,
    delta,
  } = React.useMemo(() => {
    const morningVals = filteredData
      .filter((d) => d.period === 'morning')
      .map((d) => d.wpm);
    const eveningVals = filteredData
      .filter((d) => d.period === 'evening')
      .map((d) => d.wpm);
    const mMedian = morningVals.length ? quantile(morningVals, 0.5) : null;
    const eMedian = eveningVals.length ? quantile(eveningVals, 0.5) : null;
    const diff =
      mMedian != null && eMedian != null ? eMedian - mMedian : null;
    return {
      morningMedian: mMedian,
      eveningMedian: eMedian,
      morningCount: morningVals.length,
      eveningCount: eveningVals.length,
      delta: diff,
    };
  }, [filteredData]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading reading speed data...</p>}
      {error && !loading && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p>No reading speed data available.</p>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <div
          role="group"
          aria-label="Preset filters"
          style={{
            display: 'inline-flex',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setPreset('all')}
            aria-pressed={preset === 'all'}
            style={{
              padding: '0.25rem 0.5rem',
              background: preset === 'all' ? '#e5e7eb' : 'transparent',
              borderRight: '1px solid #ccc',
            }}
          >
            All
          </button>
          <button
            onClick={() => setPreset('deep')}
            aria-pressed={preset === 'deep'}
            style={{
              padding: '0.25rem 0.5rem',
              background: preset === 'deep' ? '#e5e7eb' : 'transparent',
              borderRight: '1px solid #ccc',
            }}
          >
            Deep
          </button>
          <button
            onClick={() => setPreset('normal')}
            aria-pressed={preset === 'normal'}
            style={{
              padding: '0.25rem 0.5rem',
              background: preset === 'normal' ? '#e5e7eb' : 'transparent',
              borderRight: '1px solid #ccc',
            }}
          >
            Normal
          </button>
          <button
            onClick={() => setPreset('skimming')}
            aria-pressed={preset === 'skimming'}
            style={{
              padding: '0.25rem 0.5rem',
              background: preset === 'skimming' ? '#e5e7eb' : 'transparent',
              borderRight: 'none',
            }}
          >
            Skimming
          </button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
      {morningMedian != null && eveningMedian != null && (
        <div
          style={{
            margin: '1rem 0',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          {`Morning median ${Math.round(morningMedian)} WPM (n=${morningCount}) vs Evening median ${Math.round(eveningMedian)} WPM (n=${eveningCount}, Δ = ${Math.round(delta)} WPM)`}
        </div>
      )}
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
        data-testid="tooltip"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          background: 'rgba(255,255,255,0.9)',
          color: '#000',
          border: '1px solid #777',
          padding: '4px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={showOutliers}
            onChange={(e) => setShowOutliers(e.target.checked)}
          />
          Show outliers
        </label>
      </div>
    </div>
  );
}
