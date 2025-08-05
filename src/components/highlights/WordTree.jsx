import React, { useState, useRef, useEffect } from 'react';
import { hierarchy, tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { linkHorizontal } from 'd3-shape';
import highlights from '@/data/kindle/highlights.json';

function getExpansions(word) {
  const counts = {};
  const target = word.toLowerCase();
  for (const h of highlights) {
    const parts = h.toLowerCase().split(/\s+/);
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === target) {
        const next = parts[i + 1];
        counts[next] = (counts[next] || 0) + 1;
      }
    }
  }
  return Object.entries(counts).map(([w, count]) => ({ word: w, count }));
}

export default function WordTree() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const root = hierarchy(data);
    const layout = tree().nodeSize([24, 120]);
    layout(root);
    const link = linkHorizontal().x(d => d.y).y(d => d.x);
    svg
      .attr('viewBox', [-20, -20, 800, 400])
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('d', link);
    const node = svg
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .on('click', async (event, d) => {
        const expansions = getExpansions(d.data.word);
        d.data.children = expansions.map(e => ({ word: e.word, count: e.count }));
        setData({ ...data });
      });
    node.append('circle').attr('r', 4).attr('fill', '#555');
    node
      .append('text')
      .attr('x', 8)
      .attr('dy', '0.32em')
      .text(d => `${d.data.word}${d.data.count ? ` (${d.data.count})` : ''}`);
  }, [data]);

  const handleSubmit = async e => {
    e.preventDefault();
    const expansions = getExpansions(keyword);
    setData({ word: keyword, children: expansions.map(e => ({ word: e.word, count: e.count })) });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword"
        />
        <button type="submit" className="px-2 py-1 border">
          Search
        </button>
      </form>
      <svg ref={svgRef} width={800} height={400}></svg>
    </div>
  );
}
