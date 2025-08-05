import React, { useState, useRef, useEffect } from 'react';
import { hierarchy, tree, cluster } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { linkHorizontal } from 'd3-shape';
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
  const [layout, setLayout] = useState('linear');
  const svgRef = useRef(null);

  const toggleNode = d => {
    if (d.data.expanded) {
      d.data._children = d.data.children;
      d.data.children = undefined;
      d.data.expanded = false;
    } else {
      if (d.data._children) {
        d.data.children = d.data._children;
        d.data._children = undefined;
        d.data.expanded = true;
      } else {
        const expansions = getExpansions(d.data.word);
        d.data.children = expansions.map(e => ({
          id: `${d.data.id}-${e.word}`,
          word: e.word,
          count: e.count,
          sentiment: e.sentiment,
          expanded: false,
        }));
        d.data.expanded = true;
      }
    }
    setData({ ...data });
  };

  useEffect(() => {
    if (!data) return;
    const svg = select(svgRef.current);

    const t = transition().duration(400);

    const linkGroup = svg
      .selectAll('g.links')
      .data([null])
      .join('g')
      .attr('class', 'links');

    const nodeGroup = svg
      .selectAll('g.nodes')
      .data([null])
      .join('g')
      .attr('class', 'nodes');

    const root = hierarchy(data, d => d.children);

    const project = (x, y) => {
      if (layout === 'radial') {
        const tx = y * Math.cos(x - Math.PI / 2);
        const ty = y * Math.sin(x - Math.PI / 2);
        return [tx, ty];
      }
      return [y, x];
    };

    let linkFn;

    if (layout === 'radial') {
      const radius = 180;
      const layoutAlg = cluster().size([2 * Math.PI, radius]);
      layoutAlg(root);
      linkFn = linkHorizontal()
        .x(d => project(d.x, d.y)[0])
        .y(d => project(d.x, d.y)[1]);
      svg.attr(
        'viewBox',
        [-radius - 20, -radius - 20, (radius + 20) * 2, (radius + 20) * 2]
      );
    } else {
      const layoutAlg = tree().nodeSize([24, 120]);
      layoutAlg(root);
      linkFn = linkHorizontal().x(d => d.y).y(d => d.x);
      svg.attr('viewBox', [-20, -20, 800, 400]);
    }

    const links = root.links();
    const nodes = root.descendants();

    nodes.forEach(d => {
      d.data.x0 = d.data.x0 ?? d.x;
      d.data.y0 = d.data.y0 ?? d.y;
    });

    const link = linkGroup.selectAll('path').data(links, d => d.target.data.id);

    link
      .join(
        enter =>
          enter
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'var(--chart-network-link)')
            .attr('d', d => {
              const o = { x: d.source.data.x0, y: d.source.data.y0 };
              return linkFn({ source: o, target: o });
            })
            .call(enter => enter.transition(t).attr('d', linkFn)),
        update => update.call(update => update.transition(t).attr('d', linkFn)),
        exit =>
          exit
            .call(exit =>
              exit
                .transition(t)
                .attr('d', d => {
                  const o = { x: d.source.x, y: d.source.y };
                  return linkFn({ source: o, target: o });
                })
                .remove()
            )
      );

    const node = nodeGroup.selectAll('g').data(nodes, d => d.data.id);

    const nodeEnter = node
      .enter()
      .append('g')
      .attr('transform', d => {
        const p = d.parent || d;
        const [tx, ty] = project(p.data.x0, p.data.y0);
        return `translate(${tx},${ty})`;
      })
      .on('click', (event, d) => toggleNode(d));

    nodeEnter
      .append('circle')
      .attr('r', 0)
      .attr('fill', 'var(--chart-wordtree-node)')
      .transition(t)
      .attr('r', 4);

    nodeEnter.append('text').attr('x', 8).attr('dy', '0.32em');

    const nodeMerge = nodeEnter.merge(node);

    nodeMerge
      .select('text')
      .attr('fill', d => sentimentColor(d.data.sentiment || 0))
      .text(d => `${d.data.word}${d.data.count ? ` (${d.data.count})` : ''}`);

    nodeMerge
      .transition(t)
      .attr('transform', d => {
        const [tx, ty] = project(d.x, d.y);
        return `translate(${tx},${ty})`;
      });

    node
      .exit()
      .transition(t)
      .attr('transform', d => {
        const p = d.parent || d;
        const [tx, ty] = project(p.x, p.y);
        return `translate(${tx},${ty})`;
      })
      .remove();

    nodeMerge.each(function (d) {
      select(this).select('rect').remove();
      if (!d.data.count) return;
      const siblingMax = d.parent
        ? Math.max(...d.parent.children.map(c => c.data.count || 0))
        : d.data.count;
      const textWidth = select(this).select('text').node().getBBox().width;
      const scale = scaleLinear().domain([0, siblingMax]).range([0, 60]);
      select(this)
        .append('rect')
        .attr('x', 8 + textWidth + 4)
        .attr('y', -3)
        .attr('height', 6)
        .attr('width', scale(d.data.count))
        .attr('fill', 'var(--chart-wordtree-bar)');
    });

    nodes.forEach(d => {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });

    return () => {
      svg.selectAll('.links path').interrupt();
      svg.selectAll('.nodes g').interrupt();
    };
  }, [data, layout]);

  const handleSubmit = async e => {
    e.preventDefault();
    const expansions = getExpansions(keyword);
    setData({
      id: keyword,
      word: keyword,
      sentiment: sentimentAnalyzer.analyze(keyword).score,
      expanded: true,
      children: expansions.map(e => ({
        id: `${keyword}-${e.word}`,
        word: e.word,
        count: e.count,
        sentiment: e.sentiment,
        expanded: false,
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
          onClick={() => setLayout(layout === 'linear' ? 'radial' : 'linear')}
        >
          {layout === 'linear' ? 'Radial' : 'Linear'}
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
      <svg ref={svgRef} width={layout === 'linear' ? 800 : 400} height={400}></svg>
    </div>
  );
}
