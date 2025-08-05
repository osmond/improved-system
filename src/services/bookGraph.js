function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

function wordSet(texts = []) {
  const words = new Set();
  for (const t of texts) {
    t
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .forEach((w) => words.add(w));
  }
  return [...words];
}

function buildBookGraph(books = []) {
  const nodes = books.map((b) => ({
    id: b.asin,
    title: b.title,
    authors: b.authors || [],
    tags: b.tags || [],
  }));
  const links = [];
  for (let i = 0; i < books.length; i++) {
    for (let j = i + 1; j < books.length; j++) {
      const b1 = books[i];
      const b2 = books[j];
      const tagSim = jaccard(b1.tags || [], b2.tags || []);
      const authorSim = jaccard(b1.authors || [], b2.authors || []);
      const h1 = wordSet(b1.highlights || []);
      const h2 = wordSet(b2.highlights || []);
      const highlightSim = jaccard(h1, h2);
      const weight = tagSim + authorSim + highlightSim;
      if (weight > 0) {
        links.push({ source: b1.asin, target: b2.asin, weight });
      }
    }
  }
  return { nodes, links };
}

module.exports = { buildBookGraph };
