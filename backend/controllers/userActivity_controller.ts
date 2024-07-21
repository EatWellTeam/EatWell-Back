import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import UserActivity, { IUserActivity } from "../models/userActivity_model";

class UserActivityController extends BaseController<IUserActivity> {
  constructor() {
    super(UserActivity);
  }

  async updateWeight(req: Request, res: Response) {
    try {
      const { userId, weight } = req.body;

      if (!userId || !weight) {
        return res.status(400).json({ message: "User ID and weight are required" });
      }

      const userActivity = await UserActivity.findOne({ user: userId });

      if (!userActivity) {
        return res.status(404).json({ message: "User activity not found" });
      }

      userActivity.currentWeight = weight;
      userActivity.weightHistory.push({ weight, date: new Date() });

      await userActivity.save();

      res.status(200).json(userActivity);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getWeightHistory(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userActivity = await UserActivity.findOne({ user: userId });

      if (!userActivity) {
        return res.status(404).json({ message: "User activity not found" });
      }

      res.status(200).json(userActivity.weightHistory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  async getActivityById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userActivity = await UserActivity.findOne({ user: userId });

      if (!userActivity) {
        return res.status(404).json({ message: "User activity not found" });
      }

      res.status(200).json(userActivity);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  calculateBMR(gender: string, age: number, weight: number, height: number): number {
    if (gender.toLowerCase() === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  adjustForActivityLevel(bmr: number, activityLevel: string): number {
    switch (activityLevel) {
      case 'sedentary':
        return bmr * 1.2;
      case 'lightlyActive':
        return bmr * 1.375;
      case 'moderatelyActive':
        return bmr * 1.55;
      case 'veryActive':
        return bmr * 1.725;
      default:
        return bmr * 1.2; // Default to sedentary if unknown
    }
  }

   adjustForGoal(calories: number, goal: string): number {
    switch (goal) {
      case 'lose':
        return calories - 500; // Create a 500 calorie deficit
      case 'gain':
        return calories + 500; // Create a 500 calorie surplus
      case 'maintain':
      default:
        return calories;
    }
  }

   calculateRecommendedCalories(
    gender: string,
    age: number,
    currentWeight: number,
    height: number,
    activityLevel: string,
    goal: string
  ): number {
    const bmr = this.calculateBMR(gender, age, currentWeight, height);
    const adjustedForActivity =this. adjustForActivityLevel( bmr, activityLevel);
    const recommendedCalories =this. adjustForGoal( adjustedForActivity, goal);
    return Math.round( recommendedCalories); // Round to nearest whole number
  }




}



export default new UserActivityController();