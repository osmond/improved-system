const fs = require('fs');
const path = require('path');
const { buildBookGraph } = require('../src/services/bookGraph');

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
  const base = 'data/kindle/Kindle/Kindle.UnifiedLibraryIndex/datasets';
  const orders = loadCsv(
    `${base}/Kindle.UnifiedLibraryIndex.CustomerOrders/Kindle.UnifiedLibraryIndex.CustomerOrders.csv`
  );
  const authors = loadCsv(
    `${base}/Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship/Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship.csv`
  );
  const genres = loadCsv(
    `${base}/Kindle.UnifiedLibraryIndex.CustomerGenres/Kindle.UnifiedLibraryIndex.CustomerGenres.csv`
  );

  const highlightsPath = path.join(
    __dirname,
    '..',
    'data',
    'kindle',
    'highlights.json'
  );
  let highlights = {};
  if (fs.existsSync(highlightsPath)) {
    highlights = JSON.parse(fs.readFileSync(highlightsPath, 'utf-8'));
  }

  const books = new Map();
  for (const o of orders) {
    const asin = o.ASIN;
    if (!asin) continue;
    if (!books.has(asin)) {
      books.set(asin, {
        asin,
        title: o['Product Name'] || asin,
        authors: [],
        tags: [],
        highlights: [],
      });
    }
  }

  for (const a of authors) {
    const asin = a.ASIN;
    const name = a['Author Name'];
    const book = books.get(asin);
    if (book && name && !book.authors.includes(name)) {
      book.authors.push(name);
    }
  }

  for (const g of genres) {
    const asin = g.ASIN;
    const genre = g.Genre;
    const book = books.get(asin);
    if (book && genre && !book.tags.includes(genre)) {
      book.tags.push(genre);
    }
  }

  for (const [asin, texts] of Object.entries(highlights)) {
    const book = books.get(asin);
    if (book) book.highlights.push(...texts);
  }

  const bookList = Array.from(books.values());
  const graph = buildBookGraph(bookList);
  const outPath = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'kindle',
    'book-graph.json'
  );
  fs.writeFileSync(outPath, JSON.stringify(graph, null, 2));
  console.log(`Wrote ${graph.nodes.length} nodes and ${graph.links.length} links to ${outPath}`);
}

if (require.main === module) {
  main();
}
