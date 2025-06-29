console.log("✅ contentRoutes loaded");
import express from "express";
import Content from "../models/Article.js"; // from contentRoutes.js

const router = express.Router();

router.get('/test', (req, res) => {
  res.send('API is alive');
});

router.get('/random', async (req, res) => {
  const count = parseInt(req.query.count) || 6;

  try {
    const randomArticles = await Content.aggregate([{ $sample: { size: count } }]);
    res.status(200).json(randomArticles);
  } catch (error) {
    console.error("Error fetching random articles:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// New daily cached route
router.get('/daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let dailyEntry = await DailyContent.findOne({ date: today });
    if (dailyEntry) {
      return res.status(200).json(dailyEntry.articles);
    }

    // Not found? Generate, save, and return
    const randomArticles = await Content.aggregate([{ $sample: { size: 6 } }]);

    dailyEntry = new DailyContent({ date: today, articles: randomArticles });
    await dailyEntry.save();

    res.status(200).json(randomArticles);
  } catch (error) {
    console.error("Error fetching daily articles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Content.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

