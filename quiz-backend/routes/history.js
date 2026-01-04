const express = require("express");
const router = express.Router();
const QuizHistory = require("../models/QuizHistory");
const User = require("../models/User");


// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("History route working");
});

// SAVE quiz history
router.post("/save", async (req, res) => {
  try {
    console.log("SAVE API HIT");
    console.log(req.body);

const {
  userType,
  userId,
  name,
  category,
  level,
  timer,
  score,
  totalQuestions,
  earnedPoints
} = req.body;


    if (!userId) {
      return res.status(400).json({ error: "userId missing" });
    }

    const history = new QuizHistory({
      userType,
      userId,
      category,
      level,
      timer,
      score,
      totalQuestions,
      earnedPoints
    });

await history.save();

// 🔥 UPDATE USER TOTAL POINTS (ONLY FOR LOGGED-IN USERS)
if (userType === "user") {
  await User.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: { name: name || "User" },
      $inc: { totalPoints: earnedPoints },
    },
    { upsert: true, new: true }
  );
}


console.log("SAVED TO MONGODB & USER POINTS UPDATED");

res.status(201).json({ message: "Quiz history saved & points updated" });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ error: "Failed to save quiz history" });
  }
});

// GET LAST QUIZ BY USER
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await QuizHistory
      .find({ userId })
      .sort({ playedAt: -1 })
      .limit(1);

    res.json(history);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ error: "Failed to fetch quiz history" });
  }
});

module.exports = router;
