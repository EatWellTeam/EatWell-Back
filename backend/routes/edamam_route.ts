import express from "express";
import { setUpNutritionData, setUpRecipes } from "../controllers/edamam_controller";
const router = express.Router();

router.post("/get-nutrition", setUpNutritionData);
router.post("/get-recipes", setUpRecipes);
   

export default router;
