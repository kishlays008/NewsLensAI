import express from "express";
import { getBookmarks, addBookmark, removeBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getBookmarks);
router.post("/:articleId", addBookmark);
router.delete("/:articleId", removeBookmark);

export default router;
