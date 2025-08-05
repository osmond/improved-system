import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

export default function ReadingSpeedViolin() {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/kindle/reading-speed');
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const filtered = data.filter(
      (d) => (showMorning && d.period === 'morning') || (showEvening && d.period === 'evening'),
    );
    if (filtered.length === 0) return;

    const values = filtered.map((d) => d.wpm);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bins = 20;
    const binSize = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    for (const v of values) {
      const idx = Math.min(bins - 1, Math.floor((v - min) / binSize));
      counts[idx] += 1;
    }
    const maxCount = Math.max(...counts);

    const width = 400;
    const height = 300;
    const x = scaleLinear().domain([0, maxCount]).range([0, width / 2]);
    const y = scaleLinear().domain([min, max]).range([height, 0]);

    const group = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g');
    counts.forEach((c, i) => {
      const y0 = y(min + i * binSize);
      const y1 = y(min + (i + 1) * binSize);
      const w = x(c);
      group
        .append('rect')
        .attr('x', width / 2 - w)
        .attr('y', y1)
        .attr('width', w * 2)
        .attr('height', y0 - y1)
        .attr('fill', '#69b3a2');
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
