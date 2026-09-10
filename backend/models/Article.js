import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    source: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["technology", "sports", "business", "health", "entertainment", "science"],
    },
    author: {
      type: String,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;