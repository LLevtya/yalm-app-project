import express from "express";
import Test from "../models/Test.js";
const router = express.Router();

// GET all available tests
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find({}, "title description type");
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tests" });
  }
});

// GET a specific test
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

