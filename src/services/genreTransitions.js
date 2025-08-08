function calculateGenreTransitions(sessions, genres = []) {
  const genreByAsin = {};
  for (const g of genres) {
    const asin = g.ASIN;
    const genre = g.Genre;
    if (asin && genre && !genreByAsin[asin]) {
      genreByAsin[asin] = genre;
    }
  }

  let unknownCount = 0;
  const list = sessions
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((s) => {
      const genre = genreByAsin[s.asin] || 'Unknown';
      if (genre === 'Unknown') unknownCount += 1;
      return {
        genre,
        start: s.start,
      };
    });

  const map = {};
  for (let i = 0; i < list.length - 1; i++) {
    const source = list[i].genre;
    const target = list[i + 1].genre;
    if (source === target) continue;
    const key = `${source}->${target}`;
    if (!map[key]) {
      map[key] = {
        count: 0,
        monthlyCounts: Array(12).fill(0),
      };
    }
    const month = new Date(list[i + 1].start).getUTCMonth();
    map[key].count += 1;
    map[key].monthlyCounts[month] += 1;
  }

  const transitions = Object.entries(map).map(([key, value]) => {
    const [source, target] = key.split('->');
    return { source, target, count: value.count, monthlyCounts: value.monthlyCounts };
  });

  function buildGraph(list) {
    const g = {};
    for (const { source, target } of list) {
      if (!g[source]) g[source] = [];
      g[source].push(target);
    }
    return g;
  }

  function findCycle(g) {
    const visited = new Set();
    const stack = new Set();
    function dfs(node, path) {
      if (stack.has(node)) {
        const start = path.indexOf(node);
        return path.slice(start).concat(node);
      }
      if (visited.has(node)) return null;
      visited.add(node);
      stack.add(node);
      for (const n of g[node] || []) {
        const res = dfs(n, path.concat(n));
        if (res) return res;
      }
      stack.delete(node);
      return null;
    }
    for (const node of Object.keys(g)) {
      const res = dfs(node, [node]);
      if (res) return res;
    }
    return null;
  }

  const edges = transitions.slice();
  while (true) {
    const g = buildGraph(edges);
    const cycle = findCycle(g);
    if (!cycle) break;
    let minIndex = -1;
    let minCount = Infinity;
    for (let i = 0; i < cycle.length - 1; i++) {
      const src = cycle[i];
      const tgt = cycle[i + 1];
      const idx = edges.findIndex((e) => e.source === src && e.target === tgt);
      if (idx >= 0 && edges[idx].count < minCount) {
        minCount = edges[idx].count;
        minIndex = idx;
      }
    }
    if (minIndex >= 0) edges.splice(minIndex, 1);
    else break;
  }

  return {
    transitions: edges,
    unknownCount,
    totalSessions: list.length,
  };
}

module.exports = { calculateGenreTransitions };
