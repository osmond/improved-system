const fs = require('fs');
const path = require('path');
const { aggregateDailyReading } = require('../../src/services/readingStats');
const { aggregateReadingSessions } = require('../../src/services/readingSessions');
const { calculateReadingSpeeds } = require('../../src/services/readingSpeed');
const { buildGenreHierarchy } = require('../../src/services/genreHierarchy');
const { calculateGenreTransitions } = require('../../src/services/genreTransitions');
const { buildHighlightIndex, getExpansions } = require('../../src/services/highlightIndex');
const { getSessionLocations } = require('../../src/services/locationData');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = line.split(',');
    const record = {};
    headers.forEach((h, i) => {
      const value = values[i] || '';
      record[h.trim()] = value.replace(/^"|"$/g, '');
    });
    return record;
  });
}

function getEvents() {
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
  return parseCsv(filePath);
}

function getPoints() {
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
  const rows = parseCsv(filePath);
  return rows[0] || {};
}

function getAchievements() {
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
  return parseCsv(filePath);
}

function getDailyStats() {
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
  const rows = parseCsv(filePath);
  return aggregateDailyReading(rows);
}

function getSessions() {
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
  const sessions = parseCsv(sessionsPath);
  const highlights = parseCsv(highlightsPath);
  const orders = parseCsv(ordersPath);
  return aggregateReadingSessions(sessions, highlights, orders);
}

function getReadingSpeed() {
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
  const sessions = parseCsv(sessionsPath);
  return calculateReadingSpeeds(sessions);
}

function getGenreHierarchy() {
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

  const sessions = parseCsv(sessionsPath);
  const orders = parseCsv(ordersPath);
  const authors = parseCsv(authorsPath);
  const genres = parseCsv(genresPath);
  const tags = parseCsv(tagsPath);

  const aggregated = aggregateReadingSessions(sessions, [], orders);
  return buildGenreHierarchy(aggregated, genres, authors, tags);
}

function getGenreTransitions(start, end) {
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

  const sessions = parseCsv(sessionsPath);
  const orders = parseCsv(ordersPath);
  const genres = parseCsv(genresPath);

  let aggregated = aggregateReadingSessions(sessions, [], orders);
  if (start) aggregated = aggregated.filter((s) => s.start >= start);
  if (end) aggregated = aggregated.filter((s) => s.start <= end);
  return calculateGenreTransitions(aggregated, genres);
}

let highlightTrie = null;
function getHighlightTrie() {
  if (!highlightTrie) {
    const filePath = path.join(__dirname, '..', '..', 'data', 'kindle', 'highlights.json');
    const texts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    highlightTrie = buildHighlightIndex(texts);
  }
  return highlightTrie;
}

function getHighlightExpansions(keyword) {
  const trie = getHighlightTrie();
  return getExpansions(trie, keyword);
}

function getLocations() {
  return getSessionLocations();
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
};

