import Article from "../models/Article.js";

const VALID_CATEGORIES = ["technology", "sports", "business", "health", "entertainment", "science"];

export const getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category && category !== "all") {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limitNum),
      Article.countDocuments(query),
    ]);

    res.json({
      articles,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      totalResults: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  res.json({ categories: VALID_CATEGORIES });
};
