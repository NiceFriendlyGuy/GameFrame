const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const Entry = require('../models/Entry');

router.get('/dashboard', auth.authenticateToken, auth.requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

router.get('/users/findAll', auth.authenticateToken, auth.requireAdmin, async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/entries', auth.authenticateToken, auth.requireAdmin, async (req, res) => {
  const {
    name,
    correctAnswer,
    date
  } = req.body;

  if (!name || !correctAnswer) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newQuestion = new Entry({
      name,
      correctAnswer,
      date
    });

    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
