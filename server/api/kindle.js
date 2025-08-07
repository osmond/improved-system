const express = require('express');
const {
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
} = require('../services/kindleService');

const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/events', asyncHandler(async (req, res) => {
  res.json(await getEvents());
}));

router.get('/points', asyncHandler(async (req, res) => {
  res.json(await getPoints());
}));

router.get('/achievements', asyncHandler(async (req, res) => {
  res.json(await getAchievements());
}));

router.get('/daily-stats', asyncHandler(async (req, res) => {
  res.json(await getDailyStats());
}));

router.get('/sessions', asyncHandler(async (req, res) => {
  res.json(await getSessions());
}));

router.get('/genre-hierarchy', asyncHandler(async (req, res) => {
  res.json(await getGenreHierarchy());
}));

router.get('/genre-transitions', asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const transitions = await getGenreTransitions(start, end);
  res.json(transitions);
}));

router.get('/highlights/search', asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword query required' });
  res.json(await getHighlightExpansions(keyword));
}));

router.get('/locations', asyncHandler(async (req, res) => {
  res.json(await getLocations());
}));

router.get('/reading-speed', asyncHandler(async (req, res) => {
  res.json(await getReadingSpeed());
}));

router.get('/book-graph', asyncHandler(async (req, res) => {
  res.json(await getBookGraph());
}));

router.get('/subgenre-overrides', asyncHandler(async (req, res) => {
  res.json(await getSubgenreOverrides());
}));

router.post('/subgenre-overrides', asyncHandler(async (req, res) => {
  const { asin, subgenre } = req.body || {};
  if (!asin || !subgenre) {
    return res.status(400).json({ error: 'asin and subgenre required' });
  }
  const map = await updateSubgenreOverride(asin, subgenre);
  res.json(map);
}));

module.exports = router;
