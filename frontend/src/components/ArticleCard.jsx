import { Link } from "react-router-dom";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ArticleCard = ({ article, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/article/${article._id}`} className="block">
        <div className="aspect-video w-full overflow-hidden bg-slate-100">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
          <span>{article.category}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{article.source}</span>
        </div>

        <Link to={`/article/${article._id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 hover:text-indigo-600">
            {article.title}
          </h3>
        </Link>

        {article.summary && (
          <p className="line-clamp-3 text-sm text-slate-600">{article.summary}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">{formatDate(article.publishedAt)}</span>

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(article._id)}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                isBookmarked
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isBookmarked ? "★ Saved" : "☆ Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
