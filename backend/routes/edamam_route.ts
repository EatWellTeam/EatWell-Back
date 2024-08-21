import express from "express";
import { setUpNutritionData, setUpRecipes,setUpRecipesByCalories } from "../services/edamam";
const router = express.Router();

router.post("/get-nutrition", setUpNutritionData);
router.post("/get-recipes", setUpRecipes);
router.post("/get-recipes-by-calories", setUpRecipesByCalories);
   

export default router;
