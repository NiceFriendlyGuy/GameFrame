const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  answeredPolls: [
    {
      pollId: String,
      selectedAnswer: String,
      correctAnswer: String
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
