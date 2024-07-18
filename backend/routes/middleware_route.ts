// routes.ts
import express from "express";
import openAI from "../services/openAI";
import middleware from "../middleware/edamam_middleware";
import edamamnutrition from "../services/edamam";

const router = express.Router();

router.post("/process", openAI.fetchChatCompletion, middleware.forwardToNutrition, edamamnutrition.setUpNutritionData);

export default router;
