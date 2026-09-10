import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const MAX_CONTENT_CHARS = 8000;

// Fetches a URL and pulls out the readable article text (title + body),
// stripping nav/ads/boilerplate via Readability. Used by the "paste any URL"
// summarizer so it isn't limited to articles already in our database.
export const extractArticleFromUrl = async (url) => {
  const response = await axios.get(url.toString(), {
    timeout: 10000,
    maxRedirects: 5,
    maxContentLength: 5 * 1024 * 1024, // 5MB
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; NewsLensAI/1.0; +https://newslens-ai-seven.vercel.app)",
      Accept: "text/html",
    },
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("text/html")) {
    throw new Error("URL does not point to an HTML page");
  }

  const dom = new JSDOM(response.data, { url: url.toString() });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent || article.textContent.trim().length < 200) {
    throw new Error("Could not extract article content from this page");
  }

  return {
    title: article.title || "Untitled",
    siteName: article.siteName || url.hostname,
    content: article.textContent.trim().slice(0, MAX_CONTENT_CHARS),
  };
};
