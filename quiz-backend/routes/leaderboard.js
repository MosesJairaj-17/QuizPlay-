const express = require("express");
const router = express.Router();
const User = require("../models/User");
const QuizHistory = require("../models/QuizHistory");

router.get("/", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const limit = parseInt(req.query.limit) || 10;

    // CASE 1: OVERALL LEADERBOARD
    if (!category && !difficulty) {
      const users = await User.find({ totalPoints: { $gt: 0 } })
  .sort({ totalPoints: -1 })
  .limit(limit)
  .select("name userId totalPoints");

const userIds = users.map(u => u.userId);

// get highest single quiz points per user
const highs = await QuizHistory.aggregate([
  { $match: { userId: { $in: userIds } } },
  {
    $group: {
      _id: "$userId",
      highestPoints: { $max: "$earnedPoints" }
    }
  }
]);

const highMap = {};
highs.forEach(h => {
  highMap[h._id] = h.highestPoints;
});

const result = users.map((u, index) => ({
  rank: index + 1,
  name: u.name,
  overallPoints: u.totalPoints,
  highestPoints: highMap[u.userId] || "-"
}));


      return res.json(result);
    }

    // CASE 2: FILTERED LEADERBOARD
    const matchStage = { userType: "user" };

    if (category) matchStage.category = category.toLowerCase();
    if (difficulty) matchStage.level = difficulty.toLowerCase();

    const leaderboard = await QuizHistory.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$userId",
          overallPoints: { $sum: "$earnedPoints" },
          highestPoints: { $max: "$earnedPoints" }
        }
      },
      { $match: { overallPoints: { $gt: 0 } } }, // hide zero-point users
      { $sort: { overallPoints: -1 } },
      { $limit: limit }
    ]);

    const userIds = leaderboard.map(l => l._id);
    const users = await User.find({ userId: { $in: userIds } });

    const nameMap = {};
    users.forEach(u => {
      nameMap[u.userId] = u.name;
    });

    const finalResult = leaderboard.map((item, index) => ({
      rank: index + 1,
      name: nameMap[item._id] || "User",
      overallPoints: item.overallPoints,
      highestPoints: item.highestPoints
    }));

    res.json(finalResult);

  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
