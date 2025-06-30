import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: Number, required: true }, // 1 to 6 representing your moods
  date: { type: Date, required: true }, // store date only (no time) for daily uniqueness
});

moodSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Mood", moodSchema);
