require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Entry = require('./models/Entry');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const { fetchGameByName, getAccessToken, fetchGamesByQuery } = require('./igdb.service');

const app = express();
const PORT = Number(process.env.PORT || 3000);

// 🔐 Allowed origins (frontend URLs you trust)
const ALLOWED_ORIGINS = [
  'http://localhost:4200',
  'https://gameframe.ch',
  'https://www.gameframe.ch',
  'https://api.gameframe.ch',
  'https://admin.gameframe.ch'
];

// Make caches/proxies vary by Origin so headers aren’t cached incorrectly.
app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next(); });

// Strict CORS config
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/postman/no browser
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
app.options(/.*/, cors(corsOptions)); // preflight
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

console.log('[BOOT]', new Date().toISOString(), { cwd: process.cwd() });

// tolerate either name for Mongo URI
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('Missing MONGODB_URI/MONGO_URI');

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Error connecting to MongoDB Atlas', err));

// ================== Entry routes ==================
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/entries/latest', async (req, res) => {
  try {
    const latestEntry = await Entry.findOne().sort({ date: -1 });
    if (!latestEntry) {
      return res.status(404).json({ message: 'No entries found.' });
    }
    res.json(latestEntry);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Invalid ID or server error.' });
  }
});

// ================== IGDB routes ==================
app.get('/api/games/:name', async (req, res) => {
  try {
    const game = await fetchGameByName(req.params.name);
    res.json(game);
  } catch (err) {
    console.error('🔥 IGDB fetch error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch game' });
  }
});

app.get('/api/search/:query', async (req, res) => {
  try {
    const games = await fetchGamesByQuery(req.params.query);
    res.json(games);
  } catch (err) {
    console.error('🔥 Search error:', err.response?.data || err.message || err);
    res.status(500).json({ message: 'Failed to search games' });
  }
});

// ================== Start server ==================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
