import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import quoteRoutes from './routes/quoteRoutes.js';
import testRoutes from "./routes/testRoutes.js";


import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use('/api/quotes', quoteRoutes); 
app.use("/api/tests", testRoutes);

console.log("✅ contentRoutes mounted at /api/content");
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
