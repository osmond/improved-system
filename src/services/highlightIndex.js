function buildHighlightIndex(texts) {
  const root = new Map();
  for (const text of texts) {
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);
    for (let i = 0; i < words.length; i++) {
      let node = root;
      for (let j = i; j < words.length; j++) {
        const word = words[j];
        let entry = node.get(word);
        if (!entry) {
          entry = { count: 0, next: new Map() };
          node.set(word, entry);
        }
        entry.count++;
        node = entry.next;
      }
    }
  }
  return root;
}

function getExpansions(root, phrase) {
  const words = phrase
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);
  let node = root;
  for (const word of words) {
    const entry = node.get(word);
    if (!entry) return [];
    node = entry.next;
  }
  const results = [];
  for (const [word, entry] of node.entries()) {
    results.push({ word, count: entry.count });
  }
  results.sort((a, b) => b.count - a.count);
  return results;
}

module.exports = { buildHighlightIndex, getExpansions };
