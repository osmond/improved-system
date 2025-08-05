const fs = require('fs');
const path = require('path');
const { buildGenreHierarchy } = require('../src/services/genreHierarchy');
const { calculateGenreTransitions } = require('../src/services/genreTransitions');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, ''));
  return lines
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);
      const record = {};
      headers.forEach((h, i) => {
        const value = values[i] || '';
        record[h] = value.replace(/^"|"$/g, '');
      });
      return record;
    });
}

function loadCsv(relativePath) {
  return parseCsv(path.join(__dirname, '..', relativePath));
}

function main() {
  const sessionsPath = path.join(__dirname, '../src/data/kindle/sessions.json');
  const sessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));

  const base = 'data/kindle/Kindle/Kindle.UnifiedLibraryIndex/datasets';
  const genres = loadCsv(`${base}/Kindle.UnifiedLibraryIndex.CustomerGenres/Kindle.UnifiedLibraryIndex.CustomerGenres.csv`);
  const authors = loadCsv(`${base}/Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship/Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship.csv`);
  const tags = loadCsv(`${base}/Kindle.UnifiedLibraryIndex.CustomerTags/Kindle.UnifiedLibraryIndex.CustomerTags.csv`);

  const hierarchy = buildGenreHierarchy(sessions, genres, authors, tags);
  const hierarchyPath = path.join(__dirname, '../src/data/kindle/genre-hierarchy.json');
  fs.writeFileSync(hierarchyPath, JSON.stringify(hierarchy, null, 2));

  const transitionsRaw = calculateGenreTransitions(sessions, genres);
  const edges = transitionsRaw.slice();
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
  const transitionsPath = path.join(
    __dirname,
    '../src/data/kindle/genre-transitions.json'
  );
  fs.writeFileSync(transitionsPath, JSON.stringify(edges, null, 2));
}

main();
