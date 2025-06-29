import mongoose from "mongoose";

const dailyContentSchema = new mongoose.Schema({
  date: { type: String, unique: true }, // Format: "YYYY-MM-DD"
  articles: { type: [Object], default: [] }, // Store array of article objects
  quote: {
  text: String,
  author: String,
},
  testId: mongoose.Schema.Types.ObjectId,
});

const DailyContent = mongoose.model("DailyContent", dailyContentSchema);

export default DailyContent;
