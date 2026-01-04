const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["user", "guest"],
    required: true,
  },

  userId: {
    type: String, // Firebase email or guestId
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  level: {
    type: String,
    required: true,
  },

  timer: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },

  totalQuestions: {
    type: Number,
    required: true,
  },

  earnedPoints: {
    type: Number,
    required: true,
  },

  playedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
