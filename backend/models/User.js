const mongoose = require('mongoose');

const guessSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  guessedAt: { type: Date, default: Date.now }
}, { _id: false });

const answeredPollSchema = new mongoose.Schema({
  pollId: { type: String, required: true },
  guesses: [guessSchema],
  answered: { type: Boolean, default: false }, // whether the question is finished
  answeredAt: { type: Date } // optional: when the question was marked as answered
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  answeredPolls: [answeredPollSchema],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
