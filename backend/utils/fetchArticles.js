import Article from "../models/Article.js";
import { fetchAllCategories } from "../services/newsService.js";

export const fetchAndSaveArticles = async () => {
  console.log("Starting article fetch...");

  const articles = await fetchAllCategories();
  let savedCount = 0;
  let skippedCount = 0;

  for (const item of articles) {
    if (!item.url || !item.title) continue;

    try {
      await Article.create({
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        imageUrl: item.urlToImage,
        source: item.source?.name || "Unknown",
        category: item.category,
        author: item.author,
        publishedAt: item.publishedAt,
      });
      savedCount++;
    } catch (error) {
      if (error.code === 11000) {
        skippedCount++;
      } else {
        console.error("Error saving article:", error.message);
      }
    }
  }

  console.log(`Fetch complete: ${savedCount} saved, ${skippedCount} duplicates skipped`);
};