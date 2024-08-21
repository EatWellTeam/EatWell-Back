import axios from "axios";
import { query, Request, Response } from "express";

const NUTRITION_APP_ID = "e651fcc4";
const NUTRITION_APP_KEY = "6bdad4f156cdb5b853a26e2ac237b3cb	";
const NUTRITION_BASE_URL = "https://api.edamam.com/api/nutrition-details";
const RECIPE_APP_ID = "44900b00";
const RECIPE_APP_KEY = "d0b376affe7afa6dfba18e5c37621466	";
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
    console.log("Response from nutrition API:", response.data);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const setUpRecipesByCalories = async (req: Request, res: Response) => {
  console.log("Received request:", req.body);
  const { calorieRange, query, mealType } = req.body;
  console.log("Received calorie range:", calorieRange);
  console.log("Received query:", query);
  console.log("Received meal type:", mealType);

  try {
    const params: any = {
      type: "public",
      app_id: RECIPE_APP_ID,
      app_key: RECIPE_APP_KEY,
    };

    if (query) {
      params.q = query;
    }

    if (calorieRange) {
      params.calories = `${calorieRange.min}-${calorieRange.max}`;
    }

    if (mealType && Array.isArray(mealType) && mealType.length > 0) {
      params.mealType = mealType.join(','); // API expects mealType as a comma-separated string
    }

    const response = await axios.get(RECIPE_BASE_URL, { params });
    console.log("Response from recipes API:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};



export default { setUpNutritionData, setUpRecipes, setUpRecipesByCalories };
