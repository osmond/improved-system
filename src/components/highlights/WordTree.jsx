import React, { useState, useRef, useEffect } from 'react';
import { hierarchy, tree, cluster } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { linkHorizontal, linkRadial } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import Sentiment from 'sentiment';
import highlights from '@/data/kindle/highlights.json';

const sentimentAnalyzer = new Sentiment();
const sentimentColor = scaleLinear()
  .domain([-5, 0, 5])
  .range(['#d73027', '#ffffbf', '#1a9850']);

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
  return Object.entries(counts).map(([w, count]) => ({
    word: w,
    count,
    sentiment: sentimentAnalyzer.analyze(w).score,
  }));
}

export default function WordTree() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState(null);
  const [layoutType, setLayoutType] = useState('linear');
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    const root = hierarchy(data);

    let node, linkFn;

    if (layoutType === 'radial') {
      const radius = 180;
      const layout = cluster().size([2 * Math.PI, radius]);
      layout(root);
      linkFn = linkRadial().angle(d => d.x).radius(d => d.y);
      svg
        .attr('viewBox', [-radius - 20, -radius - 20, (radius + 20) * 2, (radius + 20) * 2])
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', 'var(--chart-network-link)')
        .attr('d', linkFn);

      node = svg
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => {
          const x = d.y * Math.cos(d.x - Math.PI / 2);
          const y = d.y * Math.sin(d.x - Math.PI / 2);
          return `translate(${x},${y})`;
        })
        .on('click', async (event, d) => {
          const expansions = getExpansions(d.data.word);
          d.data.children = expansions.map(e => ({
            word: e.word,
            count: e.count,
            sentiment: e.sentiment,
          }));
          setData({ ...data });
        });
    } else {
      const layout = tree().nodeSize([24, 120]);
      layout(root);
      linkFn = linkHorizontal().x(d => d.y).y(d => d.x);
      svg
        .attr('viewBox', [-20, -20, 800, 400])
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', 'var(--chart-network-link)')
        .attr('d', linkFn);

      node = svg
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('click', async (event, d) => {
          const expansions = getExpansions(d.data.word);
          d.data.children = expansions.map(e => ({
            word: e.word,
            count: e.count,
            sentiment: e.sentiment,
          }));
          setData({ ...data });
        });
    }

    node.each(d => {
      if (d.parent) {
        const counts = d.parent.children.map(c => c.data.count || 0);
        d.siblingMax = Math.max(...counts);
      }
    });

    node.append('circle').attr('r', 4).attr('fill', 'var(--chart-wordtree-node)');

    node
      .append('text')
      .attr('x', 8)
      .attr('dy', '0.32em')
      .attr('fill', d => sentimentColor(d.data.sentiment || 0))
      .text(d => `${d.data.word}${d.data.count ? ` (${d.data.count})` : ''}`);

    node
      .filter(d => d.data.count)
      .each(function (d) {
        const textWidth = select(this).select('text').node().getBBox().width;
        const scale = scaleLinear()
          .domain([0, d.siblingMax || d.data.count])
          .range([0, 60]);
        select(this)
          .append('rect')
          .attr('x', 8 + textWidth + 4)
          .attr('y', -3)
          .attr('height', 6)
          .attr('width', scale(d.data.count))
          .attr('fill', 'var(--chart-wordtree-bar)');
      });
  }, [data, layoutType]);

  const handleSubmit = async e => {
    e.preventDefault();
    const expansions = getExpansions(keyword);
    setData({
      word: keyword,
      sentiment: sentimentAnalyzer.analyze(keyword).score,
      children: expansions.map(e => ({
        word: e.word,
        count: e.count,
        sentiment: e.sentiment,
      })),
    });
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
        <button
          type="button"
          className="px-2 py-1 border"
          onClick={() => setLayoutType(layoutType === 'linear' ? 'radial' : 'linear')}
        >
          {layoutType === 'linear' ? 'Radial' : 'Linear'}
        </button>
      </form>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="flex items-center">
          <span className="w-4 h-4 mr-1" style={{ background: '#d73027' }}></span>Negative
        </span>
        <span className="flex items-center">
          <span className="w-4 h-4 mr-1 border" style={{ background: '#ffffbf' }}></span>Neutral
        </span>
        <span className="flex items-center">
          <span className="w-4 h-4 mr-1" style={{ background: '#1a9850' }}></span>Positive
        </span>
      </div>
      <svg ref={svgRef} width={layoutType === 'linear' ? 800 : 400} height={400}></svg>
    </div>
  );
}
