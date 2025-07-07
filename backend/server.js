const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('./models/Question');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json()); 

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


const { fetchGameByName, getAccessToken, fetchGamesByQuery } = require('./igdb.service');

// Replace "mongo" with the service name from docker-compose.yml
/*const mongoURI = 'mongodb://mongo:27017/entries';  // Update to 'mongo'

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
*/

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas', err));

// Define schema + model
const entrySchema = new mongoose.Schema({
  name: String,
});

//const Entry = require('./models/Question'); //TODO Implement question schema
const Entry = mongoose.model('Entry', entrySchema, 'entries');  // 3rd param = collection name

// Route to fetch all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/entries', async (req, res) => {
  const {
    name,
    question,
    correctAnswer,
    answer1,
    answer2,
    answer3,
    answer4,
    date
  } = req.body;

  if (!name || !question || !correctAnswer || !answer1 || !answer2 || !answer3 || !answer4) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newQuestion = new Entry({
      name,
      question,
      correctAnswer,
      answer1,
      answer2,
      answer3,
      answer4,
      date
    });

    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to fetch the latest question by date
app.get('/api/entries/latest', async (req, res) => {
  try {
    const latestEntry = await Entry.findOne().sort({ date: -1 }); // Sort descending by date
    if (!latestEntry) {
      return res.status(404).json({ message: 'No entries found.' });
    }
    res.json(latestEntry);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Route to fetch a specific entry by ID
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


//IGDB//
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




app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
