const express = require("express");
const router = express.Router();
const User = require("../models/User");
const QuizHistory = require("../models/QuizHistory");

// GET DASHBOARD DATA
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const history = await QuizHistory
      .find({ userId })
      .sort({ playedAt: -1 });

    const totalQuizzes = history.length;

    const highestPoints = history.length
      ? Math.max(...history.map(h => h.earnedPoints || 0))
      : 0;

    res.json({
      name: user.name,
      email: user.userId,
      totalPoints: user.totalPoints,
      totalQuizzes,
      highestPoints,
      history: history.slice(0, 10) // latest 10
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

module.exports = router;
