console.log("✅ contentRoutes loaded");
import express from "express";
import Content from "../models/Article.js"; // from contentRoutes.js
import DailyContent from "../models/DailyContent.js";
import Quote from "../models/Quote.js";
import Test from "../models/Test.js";
import Content from "../models/Article.js";

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
// Get daily articles, quote, and testId
router.get('/daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if daily content already exists
    let dailyEntry = await DailyContent.findOne({ date: today });
    if (dailyEntry) {
      return res.status(200).json(dailyEntry); // Return full content
    }

    // Get random articles
    const articles = await Content.aggregate([{ $sample: { size: 6 } }]);

    // Get random quote
    const quoteResult = await Quote.aggregate([{ $sample: { size: 1 } }]);
    const quote = quoteResult[0]?.text || "No quote available";

    // Get random test
    const testResult = await Test.aggregate([{ $sample: { size: 1 } }]);
    const testId = testResult[0]?._id || null;

    // Create new daily entry
    dailyEntry = new DailyContent({
      date: today,
      articles,
      quote,
      testId
    });

    await dailyEntry.save();
    res.status(200).json(dailyEntry);

  } catch (error) {
    console.error("❌ Error generating daily content:", error);
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

