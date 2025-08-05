const sessionLocations = require('../data/kindle/locations.json');

function getSessionLocations() {
  return sessionLocations;
}

module.exports = { getSessionLocations };
