import express from "express";
import Mood from "../models/Mood.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Allowed moods that match frontend exactly
const allowedMoods = ["angry", "upset", "sad", "neutral", "happy", "excited"];

// ✅ GET /api/mood/check-today → Has user logged today?
router.get("/check-today", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingMood = await Mood.findOne({
      userId,
      date: { $gte: startOfDay },
    });

    res.status(200).json({ loggedToday: !!existingMood });
  } catch (error) {
    console.error("Mood check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/mood → Save mood
router.post("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { mood } = req.body;

    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood value" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const alreadyLogged = await Mood.findOne({
      userId,
      date: { $gte: startOfDay },
    });

    if (alreadyLogged) {
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


