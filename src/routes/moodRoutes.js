import express from "express";
import Mood from "../models/Mood.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Allowed mood values - match frontend exactly!
const allowedMoods = ["angry", "upset", "sad", "neutral", "happy", "excited"];

// Check if mood logged today
router.get("/check-today", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const moodToday = await Mood.findOne({
      userId,
      date: { $gte: todayStart },
    });

    res.json({ loggedToday: !!moodToday });
  } catch (error) {
    console.error("Mood check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit mood
router.post("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { mood } = req.body;

    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood value" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingMood = await Mood.findOne({
      userId,
      date: { $gte: todayStart },
    });

    if (existingMood) {
      return res.status(400).json({ message: "Mood already logged today" });
    }

    const newMood = new Mood({
      userId,
      mood,
      date: new Date(),
    });

    await newMood.save();
    res.status(201).json({ message: "Mood logged successfully" });
  } catch (error) {
    console.error("Mood submit error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

