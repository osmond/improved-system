const fs = require('fs');
const path = require('path');
const { buildHighlightIndex } = require('../src/services/highlightIndex');

function parseMyClippings(text) {
  const entries = text.split('==========');
  const results = [];
  for (const entry of entries) {
    const lines = entry
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    if (lines[0]) {
      results.push(lines[0]);
    }
  }
  return results;
}

function parseNotebookExport(text) {
  // try JSON export
  try {
    const data = JSON.parse(text);
    const items = data.items || data.annotations || [];
    const res = [];
    for (const item of items) {
      if (typeof item === 'string') res.push(item);
      else if (item && typeof item === 'object') {
        if (item.text) res.push(item.text);
        else if (item.highlight) res.push(item.highlight);
      }
    }
    if (res.length) return res;
  } catch (err) {
    // not JSON
  }
  // fallback: treat as plain text similar to My Clippings
  return parseMyClippings(text);
}

function parseFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  if (text.includes('==========')) return parseMyClippings(text);
  return parseNotebookExport(text);
}

function main() {
  const input = process.argv[2];
  const buildIndex = process.argv.includes('--index');
  if (!input) {
    console.error('Usage: node scripts/parse-highlights.js <input-file> [--index]');
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), input);
  const highlights = parseFile(filePath);

  const outDir = path.join(__dirname, '..', 'src', 'data', 'kindle');
  const outPath = path.join(outDir, 'highlights.json');
  fs.writeFileSync(outPath, JSON.stringify(highlights, null, 2) + '\n');
  console.log(`Wrote ${highlights.length} highlights to ${outPath}`);

  if (buildIndex) {
    const index = buildHighlightIndex(highlights);
    const indexPath = path.join(outDir, 'highlight-index.json');
    // serialize Map structure to object
    const serialize = m => Object.fromEntries([...m.entries()].map(([k, v]) => [k, { count: v.count, next: serialize(v.next) }]));
    fs.writeFileSync(indexPath, JSON.stringify(serialize(index), null, 2) + '\n');
    console.log(`Wrote highlight index to ${indexPath}`);
  }
}

if (require.main === module) {
  main();
}
