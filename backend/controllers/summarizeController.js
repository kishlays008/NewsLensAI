import { assertSafeExternalUrl } from "../utils/urlSafety.js";
import { extractArticleFromUrl } from "../services/extractService.js";
import { generateSummary } from "../services/geminiService.js";

export const summarizeUrl = async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Please provide a URL" });
  }

  let safeUrl;
  try {
    safeUrl = await assertSafeExternalUrl(url);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  let article;
  try {
    article = await extractArticleFromUrl(safeUrl);
  } catch (error) {
    return res.status(422).json({ message: error.message || "Could not read that article" });
  }

  const summary = await generateSummary({
    title: article.title,
    description: "",
    content: article.content,
  });

  if (!summary) {
    return res.status(502).json({
      message: "Could not generate a summary right now (the AI service may be rate-limited). Please try again shortly.",
    });
  }

  res.json({
    title: article.title,
    source: article.siteName,
    url: safeUrl.toString(),
    summary,
  });
};
