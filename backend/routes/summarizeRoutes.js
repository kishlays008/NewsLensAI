import express from "express";
import { summarizeUrl } from "../controllers/summarizeController.js";

const router = express.Router();

router.post("/", summarizeUrl);

export default router;
