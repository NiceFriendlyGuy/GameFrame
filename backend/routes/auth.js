const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your-super-secret-key'; // replace with env var in prod

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, passwordHash });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

const token = jwt.sign(
  { userId: user._id, email: user.email }, 
  JWT_SECRET,
  { expiresIn: '7d' }
);
  res.json({ token });
});

module.exports = router;
