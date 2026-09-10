import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import CategoryTabs from "../components/CategoryTabs";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import * as articleService from "../services/articleService";

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await articleService.getArticles({ category, search, page });
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch {
      setError("Could not load articles. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    articleService
      .getBookmarks()
      .then((data) => setBookmarkedIds(new Set(data.map((a) => a._id))))
      .catch(() => {});
  }, [user]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "all" || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    next.delete("page");
    setSearchParams(next);
  };

  const handleToggleBookmark = async (articleId) => {
    if (!user) return;

    const isBookmarked = bookmarkedIds.has(articleId);
    const next = new Set(bookmarkedIds);

    try {
      if (isBookmarked) {
        next.delete(articleId);
        setBookmarkedIds(next);
        await articleService.removeBookmark(articleId);
      } else {
        next.add(articleId);
        setBookmarkedIds(next);
        await articleService.addBookmark(articleId);
      }
    } catch {
      setBookmarkedIds(bookmarkedIds);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryTabs active={category} onChange={(value) => updateParams({ category: value })} />
        <SearchBar initialValue={search} onSearch={(value) => updateParams({ search: value })} />
      </div>

      {loading && <Loader />}

      {!loading && error && <p className="py-10 text-center text-red-600">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="py-10 text-center text-slate-500">No articles found.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                isBookmarked={bookmarkedIds.has(article._id)}
                onToggleBookmark={user ? handleToggleBookmark : undefined}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setSearchParams((p) => { p.set("page", String(page - 1)); return p; })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setSearchParams((p) => { p.set("page", String(page + 1)); return p; })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
