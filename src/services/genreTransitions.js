function calculateGenreTransitions(sessions, genres = []) {
  const genreByAsin = {};
  for (const g of genres) {
    const asin = g.ASIN;
    const genre = g.Genre;
    if (asin && genre && !genreByAsin[asin]) {
      genreByAsin[asin] = genre;
    }
  }

  const list = sessions
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((s) => ({
      genre: genreByAsin[s.asin] || 'Unknown',
      start: s.start,
    }));

  const map = {};
  for (let i = 0; i < list.length - 1; i++) {
    const source = list[i].genre;
    const target = list[i + 1].genre;
    if (source === target) continue;
    const key = `${source}->${target}`;
    map[key] = (map[key] || 0) + 1;
  }

  return Object.entries(map).map(([key, count]) => {
    const [source, target] = key.split('->');
    return { source, target, count };
  });
}

module.exports = { calculateGenreTransitions };
