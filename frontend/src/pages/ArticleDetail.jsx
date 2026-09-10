import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import * as articleService from "../services/articleService";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    articleService
      .getArticleById(id)
      .then(setArticle)
      .catch(() => setError("Article not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    articleService
      .getBookmarks()
      .then((data) => setIsBookmarked(data.some((a) => a._id === id)))
      .catch(() => {});
  }, [user, id]);

  const handleToggleBookmark = async () => {
    if (!user) return;
    try {
      if (isBookmarked) {
        await articleService.removeBookmark(id);
        setIsBookmarked(false);
      } else {
        await articleService.addBookmark(id);
        setIsBookmarked(true);
      }
    } catch {
      // no-op, keep previous state
    }
  };

  if (loading) return <Loader />;

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-500">{error || "Article not found"}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to articles
      </Link>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="max-h-96 w-full rounded-xl object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
        <span>{article.category}</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">{article.source}</span>
        {article.publishedAt && (
          <>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>

        {user && (
          <button
            onClick={handleToggleBookmark}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
              isBookmarked
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isBookmarked ? "★ Saved" : "☆ Save"}
          </button>
        )}
      </div>

      {article.author && <p className="text-sm text-slate-500">By {article.author}</p>}

      {article.summary && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              AI Summary
            </p>
            <button
              onClick={() => setShowFullSummary((v) => !v)}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              {showFullSummary ? "Hide" : "Show"}
            </button>
          </div>
          {showFullSummary && <p className="text-sm text-slate-700">{article.summary}</p>}
        </div>
      )}

      <p className="whitespace-pre-line leading-relaxed text-slate-700">
        {article.content || article.description}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        Read full article at {article.source} &rarr;
      </a>
    </div>
  );
};

export default ArticleDetail;
