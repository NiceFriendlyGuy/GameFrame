const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;  // Ensure it listens on port 3000

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Replace "mongo" with the service name from docker-compose.yml
const mongoURI = 'mongodb://mongo:27017/entries';  // Update to 'mongo'

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define schema + model
const entrySchema = new mongoose.Schema({
  title: String,
  content: String
});

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

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
