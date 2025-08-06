import React, { useEffect, useRef, useState, useMemo } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { drag } from 'd3-drag';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import { zoom } from 'd3-zoom';
import graphData from '@/data/kindle/book-graph.json';

export default function BookNetwork({ data = graphData }) {
  const svgRef = useRef(null);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState('');
  const [selected, setSelected] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState(new Set());
  const [overrides, setOverrides] = useState({});
  const [subgenre, setSubgenre] = useState('');
  const [sgError, setSgError] = useState('');

  useEffect(() => {
    const degreeMap = {};
    data.links.forEach((l) => {
      degreeMap[l.source] = (degreeMap[l.source] || 0) + 1;
      degreeMap[l.target] = (degreeMap[l.target] || 0) + 1;
    });
    const nodes = data.nodes.map((n) => ({
      ...n,
      degree: degreeMap[n.id] || 0,
      expanded: true,
    }));
    setGraph({ nodes, links: data.links });
  }, [data]);

  const adjacency = useMemo(() => {
    const map = new Map();
    graph.links.forEach((l) => {
      if (!map.has(l.source)) map.set(l.source, []);
      if (!map.has(l.target)) map.set(l.target, []);
      map.get(l.source).push(l.target);
      map.get(l.target).push(l.source);
    });
    return map;
  }, [graph]);

  useEffect(() => {
    fetch('/api/kindle/subgenre-overrides')
      .then((res) => res.json())
      .then((data) => setOverrides(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selected) {
      setSubgenre(overrides[selected] || '');
      setSgError('');
    } else {
      setSubgenre('');
    }
  }, [selected, overrides]);

  const toggleNeighbors = (id) => {
    setGraph((g) => {
      const target = g.nodes.find((n) => n.id === id);
      const neigh = adjacency.get(id) || [];
      const expand = !target.expanded;
      const nodes = g.nodes.map((n) =>
        neigh.includes(n.id) ? { ...n, expanded: expand } : n
      );
      target.expanded = true;
      return { ...g, nodes };
    });
  };

  function saveSubgenre() {
    const sg = subgenre.trim();
    if (!selected) return;
    if (!sg) {
      setSgError('Sub-genre required');
      return;
    }
    if (
      overrides[selected] &&
      overrides[selected].toLowerCase() === sg.toLowerCase()
    ) {
      setSgError('Duplicate sub-genre');
      return;
    }
    fetch('/api/kindle/subgenre-overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asin: selected, subgenre: sg }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOverrides(data);
        setSgError('');
      })
      .catch(() => setSgError('Failed to save sub-genre'));
  }

  useEffect(() => {
    if (!selected || (!tag && !author)) {
      setHighlightedNodes(new Set(selected ? [selected] : []));
      setHighlightedLinks(new Set());
      return;
    }

    const targets = graph.nodes.filter(
      (n) =>
        (tag && n.tags.includes(tag)) ||
        (author && n.authors.includes(author))
    );

    const prev = {};
    const queue = [selected];
    const visited = new Set([selected]);

    while (queue.length) {
      const node = queue.shift();
      for (const neigh of adjacency.get(node) || []) {
        if (!visited.has(neigh)) {
          visited.add(neigh);
          prev[neigh] = node;
          queue.push(neigh);
        }
      }
    }

    const nodesSet = new Set([selected]);
    const linksSet = new Set();
    const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

    targets.forEach((t) => {
      let curr = t.id;
      if (!prev[curr] && curr !== selected) return;
      nodesSet.add(curr);
      while (curr !== selected) {
        const p = prev[curr];
        nodesSet.add(p);
        linksSet.add(edgeKey(curr, p));
        curr = p;
      }
    });

    setHighlightedNodes(nodesSet);
    setHighlightedLinks(linksSet);
  }, [tag, author, selected, adjacency, graph]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const width = 600;
    const height = 400;

    const chartColors = Array.from(
      { length: 10 },
      (_, i) => `hsl(var(--chart-${i + 1}))`
    );
    const color = scaleOrdinal().range(chartColors);
    const degrees = graph.nodes.map((n) => n.degree);
    const minDegree = Math.min(...degrees);
    const maxDegree = Math.max(...degrees);
    const radiusScale = scaleLinear()
      .domain([minDegree, maxDegree])
      .range([5, 15]);
    const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
    const edgeFromLink = (d) => {
      const s = typeof d.source === 'object' ? d.source.id : d.source;
      const t = typeof d.target === 'object' ? d.target.id : d.target;
      return edgeKey(s, t);
    };

    const visible = graph.nodes.filter((n) => n.expanded);
    const idSet = new Set(visible.map((n) => n.id));
    const visibleLinks = graph.links.filter(
      (l) => idSet.has(l.source) && idSet.has(l.target)
    );

    const simulation = forceSimulation(visible)
      .force('link', forceLink(visibleLinks).id((d) => d.id).distance(100))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2));

    const t = transition().duration(400);

    const g = svg
      .selectAll('g.zoom-container')
      .data([null])
      .join('g')
      .attr('class', 'zoom-container');

    const zoomBehavior = zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    const linkGroup = g
      .selectAll('g.links')
      .data([null])
      .join('g')
      .attr('class', 'links')
      .attr('stroke', 'var(--chart-network-link)')
      .attr('stroke-opacity', 0.6);

    const link = linkGroup
      .selectAll('line')
      .data(visibleLinks, edgeFromLink)
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('stroke-width', (d) =>
              highlightedLinks.has(edgeFromLink(d)) ? 3 : Math.sqrt(d.weight)
            )
            .attr('stroke', (d) =>
              highlightedLinks.has(edgeFromLink(d))
                ? 'hsl(var(--chart-1))'
                : 'var(--chart-network-link)'
            )
            .attr('data-highlighted', (d) =>
              highlightedLinks.has(edgeFromLink(d)) ? 'true' : null
            )
            .attr('stroke-opacity', 0)
            .call((e) => e.transition(t).attr('stroke-opacity', 0.6)),
        (update) => update,
        (exit) => exit.transition(t).attr('stroke-opacity', 0).remove()
      );

    const nodeGroup = g
      .selectAll('g.nodes')
      .data([null])
      .join('g')
      .attr('class', 'nodes');

    const node = nodeGroup
      .selectAll('circle')
      .data(visible, (d) => d.id)
      .join(
        (enter) => {
          const n = enter
            .append('circle')
            .attr('r', 0)
            .attr('fill', (d) => color(d.community))
            .attr('stroke', (d) =>
              highlightedNodes.has(d.id)
                ? 'hsl(var(--chart-1))'
                : 'var(--chart-network-node-border)'
            )
            .attr('stroke-width', (d) =>
              highlightedNodes.has(d.id) ? 3 : 1.5
            )
            .attr('data-testid', 'node')
            .attr('data-id', (d) => d.id)
            .attr('data-highlighted', (d) =>
              highlightedNodes.has(d.id) ? 'true' : null
            )
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .on('click', (event, d) => {
              setSelected(d.id);
              toggleNeighbors(d.id);
            })
            .call(
              drag()
                .on('start', (event, d) => {
                  if (!event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on('drag', (event, d) => {
                  d.fx = event.x;
                  d.fy = event.y;
                })
                .on('end', (event, d) => {
                  if (!event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
            );
          n.append('title').text((d) => d.title);
          n.call((e) =>
            e
              .transition(t)
              .attr('r', (d) =>
                radiusScale(d.degree) + (highlightedNodes.has(d.id) ? 3 : 0)
              )
          );
          return n;
        },
        (update) =>
          update.call((u) =>
            u
              .transition(t)
              .attr('stroke', (d) =>
                highlightedNodes.has(d.id)
                  ? 'hsl(var(--chart-1))'
                  : 'var(--chart-network-node-border)'
              )
              .attr('stroke-width', (d) =>
                highlightedNodes.has(d.id) ? 3 : 1.5
              )
          ),
        (exit) => exit.transition(t).attr('r', 0).remove()
      );

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    return () => {
      simulation.stop();
      svg.selectAll('circle').interrupt();
      svg.selectAll('line').interrupt();
    };
  }, [graph, highlightedNodes, highlightedLinks, adjacency]);

  return (
    <div>
      <div>
        <input
          placeholder="Filter by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <input
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {selected && (
          <div>
            <input
              placeholder="Sub-genre"
              value={subgenre}
              onChange={(e) => setSubgenre(e.target.value)}
            />
            <button onClick={saveSubgenre}>Save</button>
            {sgError && <div className="text-red-500 text-sm">{sgError}</div>}
          </div>
        )}
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
}
