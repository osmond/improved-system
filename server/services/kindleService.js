const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { getSessionLocations } = require('./locationData.cjs');
const { aggregateDailyReading } = require('../../src/services/readingStats');
const { aggregateReadingSessions } = require('../../src/services/readingSessions');
const { calculateReadingSpeeds } = require('../../src/services/readingSpeed');
const { buildGenreHierarchy } = require('../../src/services/genreHierarchy');
const { calculateGenreTransitions } = require('../../src/services/genreTransitions');
const { buildHighlightIndex, getExpansions } = require('../../src/services/highlightIndex');
const { buildBookGraph } = require('../../src/services/bookGraph');

function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }))
      .on('data', (record) => records.push(record))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

async function getEvents() {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.Devices.KindleNotificationsEventsAndroid',
    'Kindle.Devices.KindleNotificationsEventsAndroid.csv'
  );
  return await parseCsv(filePath);
}

async function getPoints() {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.BookIncentives.BookPoints',
    'datasets',
    'Kindle.BookIncentives.BookPointsAccounts',
    'Kindle.BookIncentives.BookPointsAccounts.csv'
  );
  const rows = await parseCsv(filePath);
  return rows[0] || {};
}

async function getAchievements() {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.BookRewards',
    'datasets',
    'Kindle.BookRewards.Achievements.1',
    'Kindle.BookRewards.Achievements.1.csv'
  );
  return await parseCsv(filePath);
}

async function getDailyStats() {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.Devices.ReadingSession',
    'Kindle.Devices.ReadingSession.csv',
  );
  const rows = await parseCsv(filePath);
  return aggregateDailyReading(rows);
}

async function getSessions() {
  const sessionsPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.Devices.ReadingSession',
    'Kindle.Devices.ReadingSession.csv',
  );
  const highlightsPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.Devices.kindleHighlightActions',
    'Kindle.Devices.kindleHighlightActions.csv',
  );
  const ordersPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerOrders',
    'Kindle.UnifiedLibraryIndex.CustomerOrders.csv',
  );
  const [sessions, highlights, orders] = await Promise.all([
    parseCsv(sessionsPath),
    parseCsv(highlightsPath),
    parseCsv(ordersPath),
  ]);
  return aggregateReadingSessions(sessions, highlights, orders);
}

async function getReadingSpeed() {
  const sessionsPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'Kindle',
    'Kindle.Devices.ReadingSession',
    'Kindle.Devices.ReadingSession.csv',
  );
  const sessions = await parseCsv(sessionsPath);
  return calculateReadingSpeeds(sessions);
}

async function getGenreHierarchy() {
  const base = path.join(__dirname, '..', '..', 'data', 'kindle', 'Kindle');

  const sessionsPath = path.join(
    base,
    'Kindle.Devices.ReadingSession',
    'Kindle.Devices.ReadingSession.csv'
  );
  const ordersPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerOrders',
    'Kindle.UnifiedLibraryIndex.CustomerOrders.csv'
  );
  const authorsPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship',
    'Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship.csv'
  );
  const genresPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerGenres',
    'Kindle.UnifiedLibraryIndex.CustomerGenres.csv'
  );
  const tagsPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerTags',
    'Kindle.UnifiedLibraryIndex.CustomerTags.csv'
  );

  const [sessions, orders, authors, genres, tags] = await Promise.all([
    parseCsv(sessionsPath),
    parseCsv(ordersPath),
    parseCsv(authorsPath),
    parseCsv(genresPath),
    parseCsv(tagsPath),
  ]);

  const aggregated = aggregateReadingSessions(sessions, [], orders);
  return buildGenreHierarchy(aggregated, genres, authors, tags);
}

async function getGenreTransitions(start, end) {
  const base = path.join(__dirname, '..', '..', 'data', 'kindle', 'Kindle');

  const sessionsPath = path.join(
    base,
    'Kindle.Devices.ReadingSession',
    'Kindle.Devices.ReadingSession.csv'
  );
  const ordersPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerOrders',
    'Kindle.UnifiedLibraryIndex.CustomerOrders.csv'
  );
  const genresPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerGenres',
    'Kindle.UnifiedLibraryIndex.CustomerGenres.csv'
  );

  const [sessions, orders, genres] = await Promise.all([
    parseCsv(sessionsPath),
    parseCsv(ordersPath),
    parseCsv(genresPath),
  ]);

  let aggregated = aggregateReadingSessions(sessions, [], orders);
  if (start) aggregated = aggregated.filter((s) => s.start >= start);
  if (end) aggregated = aggregated.filter((s) => s.start <= end);
  // include monthly transition counts in the result
  const transitions = calculateGenreTransitions(aggregated, genres);
  return transitions;
}

let highlightTrie = null;
async function getHighlightTrie() {
  if (!highlightTrie) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'data',
      'kindle',
      'highlights.json'
    );
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const map = JSON.parse(content);
      const texts = Object.values(map).flat();
      highlightTrie = buildHighlightIndex(texts);
    } catch (err) {
      if (err.code === 'ENOENT') {
        highlightTrie = buildHighlightIndex([]);
      } else if (err instanceof SyntaxError) {
        throw new Error('Invalid highlights file');
      } else {
        throw new Error(`Failed to read highlights file: ${err.message}`);
      }
    }
  }
  return highlightTrie;
}

async function getHighlightExpansions(keyword) {
  try {
    const trie = await getHighlightTrie();
    return getExpansions(trie, keyword);
  } catch (err) {
    throw new Error(`Unable to get highlight expansions: ${err.message}`);
  }
}

async function getLocations() {
  return getSessionLocations();
}

async function getBookGraph() {
  const base = path.join(__dirname, '..', '..', 'data', 'kindle', 'Kindle');

  const ordersPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerOrders',
    'Kindle.UnifiedLibraryIndex.CustomerOrders.csv'
  );
  const authorsPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship',
    'Kindle.UnifiedLibraryIndex.CustomerAuthorNameRelationship.csv'
  );
  const genresPath = path.join(
    base,
    'Kindle.UnifiedLibraryIndex',
    'datasets',
    'Kindle.UnifiedLibraryIndex.CustomerGenres',
    'Kindle.UnifiedLibraryIndex.CustomerGenres.csv'
  );
  const highlightsPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'kindle',
    'highlights.json'
  );

  const [orders, authors, genres, highlightsContent] = await Promise.all([
    parseCsv(ordersPath),
    parseCsv(authorsPath),
    parseCsv(genresPath),
    fs.promises.readFile(highlightsPath, 'utf-8'),
  ]);
  const highlights = JSON.parse(highlightsContent);

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
    if (book && name && !book.authors.includes(name)) book.authors.push(name);
  }

  for (const g of genres) {
    const asin = g.ASIN;
    const genre = g.Genre;
    const book = books.get(asin);
    if (book && genre && !book.tags.includes(genre)) book.tags.push(genre);
  }

  for (const [asin, texts] of Object.entries(highlights)) {
    const book = books.get(asin);
    if (book) book.highlights.push(...texts);
  }

  const bookList = Array.from(books.values());
  return buildBookGraph(bookList);
}

const subgenreOverridePath = path.join(
  __dirname,
  '..',
  '..',
  'src',
  'data',
  'kindle',
  'subgenre-overrides.json'
);

async function getSubgenreOverrides() {
  try {
    const content = await fs.promises.readFile(subgenreOverridePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function updateSubgenreOverride(asin, subgenre) {
  if (!asin || !subgenre) return getSubgenreOverrides();
  const overrides = await getSubgenreOverrides();
  overrides[asin] = subgenre;
  await fs.promises.writeFile(
    subgenreOverridePath,
    JSON.stringify(overrides, null, 2)
  );
  return overrides;
}

module.exports = {
  getEvents,
  getPoints,
  getAchievements,
  getDailyStats,
  getSessions,
  getGenreHierarchy,
  getGenreTransitions,
  getHighlightExpansions,
  getLocations,
  getReadingSpeed,
  getBookGraph,
  getSubgenreOverrides,
  updateSubgenreOverride,
};

