const express = require('express');
const { getEvents, getPoints, getAchievements } = require('../services/kindle');

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

module.exports = router;

