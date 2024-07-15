
import axios from 'axios';

const APP_ID = '08d95f6a'
const APP_KEY = '5df62f05cffe0b54753833a587409e09'
const BASE_URL = 'https://api.edamam.com/api/nutrition-data'

const getNutritionData = async (ingredients: string) => {
    try {
      const params = {
        app_id: APP_ID,
        app_key: APP_KEY,
        ingr: ingredients
      };
      
      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      throw error;
    }
  };


   export const setUpNutritionData = async (req, res) => {
    const { ingredients } = req.body;
  
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array of strings' });
    }
  
    try {
      const nutritionData = await getNutritionData(ingredients.join('\n')); // Join the array into a single string
      res.json(nutritionData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch nutrition data' });
    }
  }

export default setUpNutritionData;
