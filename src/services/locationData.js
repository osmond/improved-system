const sessionLocations = [
  {
    start: '2018-01-13T03:49:45Z',
    title: 'Sample Book One',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    start: '2018-03-26T13:49:01Z',
    title: 'Sample Book Two',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    start: '2018-03-25T22:21:24Z',
    title: 'Sample Book Two',
    latitude: 40.7128,
    longitude: -74.0060,
  },
];

function getSessionLocations() {
  return sessionLocations;
}

module.exports = { getSessionLocations };
