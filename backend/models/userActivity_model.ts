import { Document, Schema, model } from "mongoose";

import { IUser } from "./user_model";

type enumActivityLevel =
  | "sedentary"
  | "lightlyActive"
  | "moderatelyActive"
  | "veryActive";

type goalEnum = "lose" | "maintain" | "gain";

export interface IUserActivity extends Document {
  user: IUser["_id"];
  gender: string;
  age?: number;
  currentWeight: number;
  WeightGoal?: number;
  weightHistory: {
    weight: number;
    date: Date;
  }[];
  height: number;
  activityLevel: enumActivityLevel;
  goal: goalEnum;
  recommendedCalories?: number;
  CalorieEaten?: number;
  nutritionValues?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;
}

const userActivitySchema = new Schema<IUserActivity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  WeightGoal: { type: Number, required: false },
  weightHistory: [{
    weight: { type: Number, required: true },
    date: { type: Date, required: true }
  }],
  height: { type: Number, required: true },
  activityLevel: { type: String, required: true },
  goal: { type: String, required: true },
  recommendedCalories: { type: Number, required: false },
  CalorieEaten: { type: Number, required: false },
  nutritionValues: {
    calories: { type: Number, required: false },
    protein: { type: Number, required: false },
    carbs: { type: Number, required: false },
    fat: { type: Number, required: false },
  },
  createdAt: { type: Date, default: Date.now },
});

const UserActivityModel = model<IUserActivity>(
  "UserActivity",
  userActivitySchema
);

export default UserActivityModel;
