const fs = require('fs');
const path = require('path');

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

module.exports = {
  getEvents,
  getPoints,
  getAchievements,
};

