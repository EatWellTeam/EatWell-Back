import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import UserActivityModel,{IUserActivity} from "../models/userActivity_model";
import bcrypt from "bcrypt";
import UserActivity from "../models/userActivity_model";
import userActivityController from "./userActivity_controller";
import { getAllUserMeals } from "./meals_controller";

import jwt from "jsonwebtoken";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }
  async updatePassword(req: Request, res: Response) {
    console.log("req.body", req.body);
    console.log("current password", req.body.password);
    console.log("new password", req.body.newPassword);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("user password", user.password);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }
    console.log("user old password - controller", user.password);
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    console.log("user new password - coontroller", user.password);

    res.json({ message: "Password updated", password: user.password });
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    await UserActivity.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
  }

  // async updateProfilePicture(req: Request, res: Response) {
  //   if (!req.file) {
  //     return res.status(400).send("No picture uploaded");
  //   } else {
  //     const user = await User.findById(req.params.id);
  //     if (!user) {
  //       return res.status(404).send("User not found");
  //     }
  //     console.log("req.file", req.file);
  //     console.log("req.file.filename", req.file.filename);

  //     user.profileImage = req.file.filename;
  //     await user.save();
  //     res.json({
  //       message: "Profile picture updated",
  //       profileImage: user.profileImage,
  //     });
  //   }
  // }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
  
      const userActivity = await UserActivityModel.findOne({ user: req.params.id });
      if (!userActivity) {
        res.status(404).send("User activity not found");
        return;
      }

      const userInfo = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        weight: userActivity.currentWeight,
        height: userActivity.height,
        weightGoal: userActivity.WeightGoal,
        activityLevel: userActivity.activityLevel,
        gender: userActivity.gender,
        goal: userActivity.goal,
        recommendedCalories: userActivity.recommendedCalories,
        eatanCalories: userActivity.CalorieEaten,
        weightHistory: userActivity.weightHistory,
        nutritions: userActivity.nutritionValues,
       
      
      };
  
      res.status(200).send(userInfo);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).send("Internal server error");
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      user.email = req.body.email;
      user.fullName = req.body.fullName;
      user.dateOfBirth = req.body.dateOfBirth;
      const age = new Date().getFullYear() - new Date(req.body.dateOfBirth).getFullYear();
      await user.save();

      try {
        const userActivity = await UserActivity.findOne({ user: user._id });
        if (!userActivity) {
          res.status(404).send("User activity not found");
          return;
        }
        userActivity.height = req.body.height;
        userActivity.activityLevel = req.body.activityLevel;
        userActivity.gender = req.body.gender;
        userActivity.goal = req.body.goal;
        userActivity.WeightGoal = req.body.weightGoal;

        const recommendedCalories = userActivityController.calculateRecommendedCalories(
          userActivity.gender.toString(),
          age,
          req.body.weight,
          req.body.height,
          userActivity.activityLevel.toString(),
          userActivity.goal.toString(),
        );
        userActivity.recommendedCalories = recommendedCalories;

        if(req.body.weight!=userActivity.currentWeight){

         await userActivityController.updateWeight(user._id.toString(), req.body.weight) as IUserActivity;
        }

        await userActivity.save();
        
        res.status(200).send("User and user activity updated");
      } catch (error) {
        console.error("Error updating user activity:", error);
        res.status(500).send("Error updating user activity");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Internal server error");
    }
  }
}

      

export default new UserController();
