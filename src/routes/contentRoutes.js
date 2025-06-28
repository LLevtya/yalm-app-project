import express from "express";
import Content from "../models/Article.js"; // Make sure this is the correct model
const router = express.Router();

// GET /contentRoutes/random?count=6
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

export default router;

