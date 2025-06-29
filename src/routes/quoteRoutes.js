import express from 'express';
import Quote from '../models/Quote.js';

const router = express.Router();

let cachedQuote = null;
let lastFetchDate = null;

router.get('/daily', async (req, res) => {
  const today = new Date().toDateString();

  if (lastFetchDate !== today || !cachedQuote) {
    try {
      const quotes = await Quote.aggregate([{ $sample: { size: 1 } }]);
      cachedQuote = quotes[0];
      lastFetchDate = today;
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      return res.status(500).json({ message: 'Could not fetch quote.' });
    }
  }

  res.status(200).json(cachedQuote);
});

export default router;
