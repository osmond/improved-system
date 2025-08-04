const express = require('express');
const {
  getEvents,
  getPoints,
  getAchievements,
  getDailyStats,
  getSessions,
  getGenreHierarchy,
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

module.exports = router;

