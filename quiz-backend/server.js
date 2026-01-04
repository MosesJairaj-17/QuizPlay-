const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // ✅ app must come FIRST

app.use(cors());
app.use(express.json());

// Routes
const historyRoutes = require("./routes/history");
const leaderboardRoutes = require("./routes/leaderboard");
const dashboardRoutes = require("./routes/dashboard");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Test root route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// PORT
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
