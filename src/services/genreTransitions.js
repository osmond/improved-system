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

  return Object.entries(map).map(([key, value]) => {
    const [source, target] = key.split('->');
    return { source, target, count: value.count, monthlyCounts: value.monthlyCounts };
  });
}

module.exports = { calculateGenreTransitions };
