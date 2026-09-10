import Article from "../models/Article.js";
import { generateSummary } from "../services/geminiService.js";

// Google's Gemini free tier caps requests per day (as low as 20/day depending on
// model/project). Cap how many we attempt per run so a quota-exhausted run fails
// fast instead of burning through every remaining slot with doomed retries, and so
// remaining articles get picked up on a later run once the quota resets.
const MAX_SUMMARIES_PER_RUN = 15;

export const generateAllSummaries = async () => {
  const articles = await Article.find({ summary: null }).limit(MAX_SUMMARIES_PER_RUN);

  console.log(`Found ${articles.length} articles without summaries (this run, capped at ${MAX_SUMMARIES_PER_RUN})`);

  let successCount = 0;
  let failCount = 0;

  for (const article of articles) {
    const summary = await generateSummary(article);

    if (summary) {
      article.summary = summary;
      await article.save();
      successCount++;
    } else {
      failCount++;
      if (failCount >= 3) {
        console.log("Stopping run early after repeated failures (likely quota exhausted).");
        break;
      }
    }
  }

  console.log(`Summaries done: ${successCount} success, ${failCount} failed`);
};