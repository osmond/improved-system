const sessionLocations = require('../../src/data/kindle/locations.json');
const asinTitleMap = require('../../src/data/kindle/asin-title-map.json');

function mapTitles(data) {
  return data.map((l) => ({
    ...l,
    title: asinTitleMap[l.title] ?? l.title,
  }));
}

function getSessionLocations() {
  return mapTitles(sessionLocations);
}

module.exports = { getSessionLocations };
