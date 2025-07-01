import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mood: {
    type: String,
    required: true,
    enum: ["angry", "upset", "sad", "neutral", "happy", "excited"],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
