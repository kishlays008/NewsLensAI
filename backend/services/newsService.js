import axios from "axios";

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

const CATEGORIES = ["technology", "sports", "business", "health", "entertainment", "science"];

export const fetchArticlesByCategory = async (category) => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        category,
        country: "us",
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error(`Error fetching ${category} articles:`, error.message);
    return [];
  }
};

export const fetchAllCategories = async () => {
  let allArticles = [];

  for (const category of CATEGORIES) {
    const articles = await fetchArticlesByCategory(category);
    const tagged = articles.map((a) => ({ ...a, category }));
    allArticles = allArticles.concat(tagged);
  }

  return allArticles;
};