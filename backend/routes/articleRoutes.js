import express from "express";
import { getArticles, getArticleById, getCategories } from "../controllers/articleController.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/categories", getCategories);
router.get("/:id", getArticleById);

export default router;
