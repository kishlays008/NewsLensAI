import { useState } from "react";
import Loader from "../components/Loader";
import * as summarizeService from "../services/summarizeService";

const Summarizer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await summarizeService.summarizeUrl(url.trim());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not summarize that URL. Please try another.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI News Summarizer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Paste a link to any news article and get an instant AI-generated summary — even for
          articles outside our database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/some-news-article"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {loading && <Loader />}

      {!loading && error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {!loading && result && (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {result.source}
            </p>
            <h2 className="text-lg font-semibold text-slate-900">{result.title}</h2>
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              AI Summary
            </p>
            <p className="text-sm text-slate-700">{result.summary}</p>
          </div>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Read the full article &rarr;
          </a>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
