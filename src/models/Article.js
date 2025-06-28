import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // URL to article image
  type: { type: String },   // e.g., "Theory", "Case Study", etc.
  author: { type: String }, // Author of the article
  content: { type: String },
  category: { type: String, required: true }, // e.g., "Cognitive", "Behavioral", etc.
  description: { type: String }, // Short description of the article
}, { timestamps: true });


const Content = mongoose.model("Content", contentSchema);

export default Content;
