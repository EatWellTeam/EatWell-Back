import { Document, Schema, Types, model } from "mongoose";
import { IUserActivity } from "./userActivity_model";
import mongoose from "mongoose";

export interface IMeals extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  calories: number;
  nutritionValues: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  // userActivities: Types.Array<IUserActivity["_id"]>;
  imageUrl: string; 
  createdAt: Date;
}

const foodSchema = new Schema<IMeals>({
  user: { 
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  nutritionValues: {
    calories: { type: Number, required: false },
    protein: { type: Number, required: false },
    carbs: { type: Number, required: false },
    fat: { type: Number, required: false },
  },
  // userActivities: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "UserActivity",
  //     required: false,
  //   },
  // ],
  imageUrl: {  
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodModel = model<IMeals>("Meals", foodSchema);

export default FoodModel;
