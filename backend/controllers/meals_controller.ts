import { Request, Response } from 'express';
import FoodModel, { IMeals } from '../models/meals_model';
import UserModel,{IUser} from '../models/user_model';
import UserActivity, { IUserActivity } from '../models/userActivity_model';

interface SaveMealRequest extends Request {
  body: {
    name: string;
    calories: number;
    nutritionValues: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    userId: string;
    imageUrl: string;
  }
}

async function saveMeal(req: SaveMealRequest, res: Response) {
  try {
    const { name, calories, nutritionValues,imageUrl, userId } = req.body;

    if (!name || !calories || !nutritionValues || !userId || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await UserModel.findOne({_id: userId});

    const newMeal = new FoodModel({
      user: user,
      name,
      calories,
      nutritionValues,
      userActivities: [userId],
      imageUrl,
      createdAt: new Date(),
    });
    console.log('New meal object created:', newMeal);

    const savedMeal = await newMeal.save();
    console.log('Meal saved:', savedMeal);

    const userActivity = await UserActivity.findOne({ user: userId });

    if (!userActivity) {
      console.error('User activity not found');
      return res.status(404).json({ message: "User activity not found" });
    }

    
    userActivity.nutritionValues = {
      calories: (userActivity.nutritionValues?.calories || 0) + nutritionValues.calories,
      protein: (userActivity.nutritionValues?.protein || 0) + nutritionValues.protein,
      carbs: (userActivity.nutritionValues?.carbs || 0) + nutritionValues.carbs,
      fat: (userActivity.nutritionValues?.fat || 0) + nutritionValues.fat
    };

    userActivity.recommendedCalories = userActivity.recommendedCalories - nutritionValues.calories;
    await userActivity.save();

    res.status(201).json({
      message: "Meal saved and user activity updated",
      meal: savedMeal,
      updatedNutritionValues: userActivity.nutritionValues
    });
  } catch (error) {
    console.error('Error saving meal:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { saveMeal };