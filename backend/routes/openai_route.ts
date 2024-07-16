import express from "express";
import OpenAIService from "../services/openAI";
const router = express.Router();

router.post("/api", OpenAIService.fetchChatCompletion);

export default router;
