import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";
import * as articleService from "../services/articleService";

const Bookmarks = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookmarks = () => {
    setLoading(true);
    articleService
      .getBookmarks()
      .then(setArticles)
      .catch(() => setError("Could not load bookmarks"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemove = async (articleId) => {
    setArticles((prev) => prev.filter((a) => a._id !== articleId));
    try {
      await articleService.removeBookmark(articleId);
    } catch {
      loadBookmarks();
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Your Bookmarks</h1>

      {loading && <Loader />}

      {!loading && error && <p className="py-10 text-center text-red-600">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="py-10 text-center text-slate-500">
          You haven't bookmarked any articles yet.
        </p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              isBookmarked
              onToggleBookmark={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
