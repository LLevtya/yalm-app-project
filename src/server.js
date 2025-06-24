import express from 'express';
import {ENV} from "./config/env.js";
import { db } from './config/db.js';
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({success: true});
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { user_id, content_id, title, descript, image_url, category_id } = req.body;

    if (!user_id || !content_id || !title || !category_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        user_id,
        content_id,
        title,
        descript,
        image_url,
        category_id,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:user_id/:content_id", async (req, res) => {
  try {
    const { user_id, content_id } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.user_id, user_id), eq(favoritesTable.content_id, content_id))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.user_id, user_id));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT );
    });