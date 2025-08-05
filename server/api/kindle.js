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
} = require('../services/kindleService');

const router = express.Router();

router.get('/events', (req, res) => {
  try {
    res.json(getEvents());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load events' });
  }
});

router.get('/points', (req, res) => {
  try {
    res.json(getPoints());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load points' });
  }
});

router.get('/achievements', (req, res) => {
  try {
    res.json(getAchievements());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load achievements' });
  }
});

router.get('/daily-stats', (req, res) => {
  try {
    res.json(getDailyStats());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load daily stats' });
  }
});

router.get('/sessions', (req, res) => {
  try {
    res.json(getSessions());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.get('/genre-hierarchy', (req, res) => {
  try {
    res.json(getGenreHierarchy());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load genre hierarchy' });
  }
});

router.get('/genre-transitions', (req, res) => {
  try {
    const { start, end } = req.query;
    res.json(getGenreTransitions(start, end));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load genre transitions' });
  }
});

router.get('/highlights/search', (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword query required' });
  try {
    res.json(getHighlightExpansions(keyword));
  } catch (err) {
    res.status(500).json({ error: 'Failed to search highlights' });
  }
});

router.get('/locations', (req, res) => {
  try {
    res.json(getLocations());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load locations' });
  }
});

router.get('/reading-speed', (req, res) => {
  try {
    res.json(getReadingSpeed());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reading speed' });
  }
});

module.exports = router;

