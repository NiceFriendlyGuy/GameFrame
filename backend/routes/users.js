const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// POST /api/users/guess
router.post('/guess', async (req, res) => {
  console.log("CREATING A NEW ENTRY");

  const { pollId, guess } = req.body;
  const userEmail = req.headers['x-user-email'];  

  if (!userEmail || !pollId || !guess) {
    return res.status(400).json({ message: 'Missing user, pollId or guess.' });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    let poll = user.answeredPolls.find(p => p.pollId === pollId);

    if (!poll) {
      poll = user.answeredPolls.create({
        pollId,
        correctAnswer: '',
        guesses: [],
        answered: false,
        answeredAt: null
      });

      user.answeredPolls.push(poll);
    }

    const guessSubdoc = poll.guesses.create({
      answer: guess  // guessedAt will be automatically set by default if you defined it in schema
    });

    poll.guesses.push(guessSubdoc);

    await user.save();

    res.status(200).json({ message: 'Guess recorded.' });

  } catch (err) {
    console.error('🔥 Error recording guess:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/answeredPolls', async (req, res) => {
  const email = req.headers['x-user-email'];

  if (!email) {
    return res.status(400).json({ message: 'Missing user email in header' });
  }

  try {
    const user = await User.findOne({ email }).select('answeredPolls -_id'); // only answeredPolls field

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user.answeredPolls);
  } catch (err) {
    console.error('Error fetching answeredPolls:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});


// POST /api/users/mark-answered
router.post('/mark-answered', async (req, res) => {
  const { pollId } = req.body;
  const userEmail = req.headers['x-user-email']; // Replace with your auth logic

  if (!userEmail || !pollId) {
    return res.status(400).json({ message: 'Missing user or pollId.' });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const poll = user.answeredPolls.find(p => p.pollId === pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found for user.' });

    poll.answered = true;
    poll.answeredAt = new Date();

    await user.save();
    res.status(200).json({ message: 'Poll marked as answered.' });
  } catch (err) {
    console.error('Error marking poll as answered:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/deleteAll', async (req, res) => {
  const userEmail = req.headers['x-user-email']; // Replace with real auth in production
  console.log("Trying to delete all answers");
  if (!userEmail) {
    return res.status(400).json({ message: 'Missing user' });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Completely clear answeredPolls
    user.answeredPolls = [];

    await user.save();

    res.status(200).json({ message: 'All poll answers successfully deleted.' });
  } catch (err) {
    console.error('Error deleting poll answers:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;
