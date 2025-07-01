import express from "express";
import Mood from "../models/Mood.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Check if user has logged mood today
router.get("/check-today", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const moodToday = await Mood.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    res.status(200).json({ loggedToday: !!moodToday });
  } catch (error) {
    console.error("Mood check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent mood history (last 7 entries)
router.get("/history", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch last 7 moods sorted descending by date
    const history = await Mood.find({ userId })
      .sort({ date: -1 })
      .limit(7)
      .select("mood date -_id"); // only return mood and date fields

    res.json({ history });
  } catch (error) {
    console.error("Mood history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Submit mood
router.post("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { mood } = req.body;

    const allowedMoods = ["angry", "upset", "sad", "good", "happy", "spectacular"];
    if (!allowedMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood value" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const alreadyLogged = await Mood.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (alreadyLogged) {
      return res.status(400).json({ message: "Mood already logged today" });
    }

    const newMood = new Mood({ userId, mood });
    await newMood.save();

    res.status(201).json({ message: "Mood logged successfully" });
  } catch (error) {
    console.error("Mood submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;



