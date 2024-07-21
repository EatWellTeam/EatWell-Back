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




}



export default new UserActivityController();