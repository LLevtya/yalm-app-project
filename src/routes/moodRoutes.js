import express from "express";
import Mood from "../models/Mood.js";
import protectRoute from "../middleware/auth.middleware.js"; // make sure user is logged in

const router = express.Router();

// Helper to get date only (YYYY-MM-DD)
const getDateOnly = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// POST /api/mood/log - Log today's mood
router.post("/log", protectRoute, async (req, res) => {
  const userId = req.user._id;
  const { mood } = req.body;

  if (!mood || mood < 1 || mood > 6) {
    return res.status(400).json({ message: "Mood must be between 1 and 6" });
  }

  try {
    const today = getDateOnly();

    // Upsert mood for today
    const moodEntry = await Mood.findOneAndUpdate(
      { userId, date: today },
      { mood, date: today },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Mood logged successfully", mood: moodEntry });
  } catch (error) {
    console.error("Mood log error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/mood/check-today - Check if mood logged today
router.get("/check-today", protectRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    const today = getDateOnly();

    const moodEntry = await Mood.findOne({ userId, date: today });

    res.status(200).json({ loggedToday: !!moodEntry });
  } catch (error) {
    console.error("Mood check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
