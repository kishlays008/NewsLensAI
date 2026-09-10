import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (article) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Summarize this news article in under 100 words. Cover who, what, when, where, and why. Return only the summary text, no preamble.

Title: ${article.title}
Description: ${article.description || ""}
Content: ${article.content || ""}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return summary.trim();
  } catch (error) {
    console.error(`Error generating summary for "${article.title}":`, error.message);
    return null;
  }
};