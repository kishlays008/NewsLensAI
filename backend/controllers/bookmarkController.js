import User from "../models/User.js";
import Article from "../models/Article.js";

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      options: { sort: { publishedAt: -1 } },
    });

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const user = await User.findById(req.user._id);

    if (user.bookmarks.some((id) => id.toString() === articleId)) {
      return res.status(400).json({ message: "Article already bookmarked" });
    }

    user.bookmarks.push(articleId);
    await user.save();

    res.status(201).json({ message: "Article bookmarked", bookmarks: user.bookmarks });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;

    const user = await User.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== articleId);
    await user.save();

    res.json({ message: "Bookmark removed", bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
