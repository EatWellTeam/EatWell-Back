import axios from "axios";
import { Request, Response } from "express";

const NUTRITION_APP_ID = "08d95f6a";
const NUTRITION_APP_KEY = "5df62f05cffe0b54753833a587409e09";
const NUTRITION_BASE_URL = "https://api.edamam.com/api/nutrition-details";
const RECIPE_APP_ID = "b9d6ac00";
const RECIPE_APP_KEY = "f45f3a0a172b9d092254a2ba00516eb4";
const RECIPE_BASE_URL = "https://api.edamam.com/api/recipes/v2";

const getNutritionData = async (ingredients: string[]) => {
  try {
    const params = {
      app_id: NUTRITION_APP_ID,
      app_key: NUTRITION_APP_KEY,
    };

    const body = {
      title: "Recipe",
      ingr: ingredients,
    };

    const response = await axios.post(NUTRITION_BASE_URL, body, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching nutrition data:");
    throw error;
  }
};

export const setUpNutritionData = async (req: Request, res: Response) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are empty" });
  }

  try {
    const nutritionData = await getNutritionData(ingredients); // Pass the array directly
    res.json({ nutritionData, ingredients });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nutrition data" });
  }
};

const getRecipes = async (query: string) => {
  try {
    const params = {
      type: "public",
      q: query,
      app_id: RECIPE_APP_ID,
      app_key: RECIPE_APP_KEY,
    };
    const response = await axios.get(RECIPE_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const setUpRecipes = async (req: Request, res: Response) => {
  console.log("Recived request:", req.body);
  const { query } = req.body;
  console.log("Received query:", query);
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query must be a string" });
  }

  try {
    const recipes = await getRecipes(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export default { setUpNutritionData, setUpRecipes };
