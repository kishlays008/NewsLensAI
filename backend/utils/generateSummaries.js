import Article from "../models/Article.js";
import { generateSummary } from "../services/geminiService.js";

export const generateAllSummaries = async () => {
  const articles = await Article.find({ summary: null });

  console.log(`Found ${articles.length} articles without summaries`);

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
    }
  }

  console.log(`Summaries done: ${successCount} success, ${failCount} failed`);
};