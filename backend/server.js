// Must run before any other local import: ES module imports are hoisted and
// execute in order, so if dotenv.config() ran after (e.g. as a later
// statement), modules like geminiService.js that read process.env at import
// time would capture `undefined` for anything only defined in .env.
import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { fetchAndSaveArticles } from "./utils/fetchArticles.js";
import { generateAllSummaries } from "./utils/generateSummaries.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";
import { rateLimit } from "./middleware/rateLimit.js";

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NewsLens backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
// The Gemini free tier is capped at ~20 requests/day, so this public,
// unauthenticated endpoint is rate-limited per IP to avoid one visitor
// exhausting the whole app's daily quota.
app.use("/api/summarize", rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }), summarizeRoutes);

// Manual triggers for refreshing content (also run on an interval below)
app.get("/api/test-fetch", async (req, res) => {
  await fetchAndSaveArticles();
  res.json({ message: "Fetch triggered, check terminal logs" });
});

app.get("/api/test-summarize", async (req, res) => {
  await generateAllSummaries();
  res.json({ message: "Summarization triggered, check terminal logs" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5002;
const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const refreshContent = async () => {
  await fetchAndSaveArticles();
  await generateAllSummaries();
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await refreshContent();
  setInterval(refreshContent, REFRESH_INTERVAL_MS);
});
