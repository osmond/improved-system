const asinTitleMap = require('../data/kindle/asin-title-map.json');

const subgenreOverrides = require('../data/kindle/subgenre-overrides.json');


function buildGenreHierarchy(sessions, genres = [], authors = [], tags = []) {
  const genreByAsin = {};
  for (const g of genres) {
    const asin = g.ASIN;
    const genre = g.Genre;
    if (asin && genre && !genreByAsin[asin]) genreByAsin[asin] = genre;
  }
  const subgenreByAsin = { ...asinSubgenreMap };
  for (const t of tags) {
    if (t['Tag Source Group'] !== 'genre') continue;
    const asin = t.ASIN;
    const name = t['Tag Name'];
    if (asin && name && !subgenreByAsin[asin]) subgenreByAsin[asin] = name;
  }
  const authorByAsin = {};
  for (const a of authors) {
    const asin = a.ASIN;
    const name = a['Author Name'];
    if (asin && name && !authorByAsin[asin]) authorByAsin[asin] = name;
  }
  const books = {};
  for (const s of sessions) {
    const asin = s.asin || s.ASIN;
    if (!asin) continue;
    const rawTitle = s.title || s['Product Name'] || asin;
    const title = asinTitleMap[asin] || asinTitleMap[rawTitle] || rawTitle;
    const minutes = Number(s.duration || s.minutes || 0);
    if (!books[asin]) {
      books[asin] = {
        title,
        minutes: 0,

        genre: genreByAsin[asin] || 'Unknown',
        subgenre: subgenreOverrides[asin] || subgenreByAsin[asin] || 'Unknown',
        author: authorByAsin[asin] || 'Unknown',

      };
    }
    books[asin].minutes += minutes;
  }
  const root = { name: 'root', children: [] };
  for (const asin in books) {
    const b = books[asin];
    let gNode = root.children.find((c) => c.name === b.genre);
    if (!gNode) {
      gNode = { name: b.genre, children: [] };
      root.children.push(gNode);
    }
    let sgNode = gNode.children.find((c) => c.name === b.subgenre);
    if (!sgNode) {
      sgNode = { name: b.subgenre, children: [] };
      gNode.children.push(sgNode);
    }
    let aNode = sgNode.children.find((c) => c.name === b.author);
    if (!aNode) {
      aNode = { name: b.author, children: [] };
      sgNode.children.push(aNode);
    }
    aNode.children.push({ name: b.title, value: b.minutes });
  }
  return root;
}

module.exports = { buildGenreHierarchy };
