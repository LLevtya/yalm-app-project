import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, enum: ["very sad", "sad", "neutral", "happy", "very happy", "excited"], required: true },
  date: { type: Date, required: true },
});

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
