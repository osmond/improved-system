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

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    res.json(await getEvents());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load events' });
  }
});

router.get('/points', async (req, res) => {
  try {
    res.json(await getPoints());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load points' });
  }
});

router.get('/achievements', async (req, res) => {
  try {
    res.json(await getAchievements());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load achievements' });
  }
});

router.get('/daily-stats', async (req, res) => {
  try {
    res.json(await getDailyStats());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load daily stats' });
  }
});

router.get('/sessions', async (req, res) => {
  try {
    res.json(await getSessions());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.get('/genre-hierarchy', async (req, res) => {
  try {
    res.json(await getGenreHierarchy());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load genre hierarchy' });
  }
});

router.get('/genre-transitions', async (req, res) => {
  try {
    const { start, end } = req.query;
    const transitions = await getGenreTransitions(start, end);
    res.json(transitions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load genre transitions' });
  }
});

router.get('/highlights/search', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword query required' });
  try {
    res.json(await getHighlightExpansions(keyword));
  } catch (err) {
    res.status(500).json({ error: 'Failed to search highlights' });
  }
});

router.get('/locations', async (req, res) => {
  try {
    res.json(await getLocations());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load locations' });
  }
});

router.get('/reading-speed', async (req, res) => {
  try {
    res.json(await getReadingSpeed());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reading speed' });
  }
});

router.get('/book-graph', async (req, res) => {
  try {
    res.json(await getBookGraph());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load book graph' });
  }
});

router.get('/subgenre-overrides', async (req, res) => {
  try {
    res.json(await getSubgenreOverrides());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subgenre overrides' });
  }
});

router.post('/subgenre-overrides', async (req, res) => {
  const { asin, subgenre } = req.body || {};
  if (!asin || !subgenre) {
    return res.status(400).json({ error: 'asin and subgenre required' });
  }
  try {
    const map = await updateSubgenreOverride(asin, subgenre);
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subgenre override' });
  }
});

module.exports = router;

