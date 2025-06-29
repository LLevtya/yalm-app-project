import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  trait: { type: String, required: true }, // e.g., "Openness", "Extraversion"
  reverse: { type: Boolean, default: false }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String }, // "big-five", etc.
  questions: [questionSchema]
}, { timestamps: true });

const Test = mongoose.model("Test", testSchema);
export default Test;
