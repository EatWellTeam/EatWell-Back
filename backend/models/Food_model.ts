import { Document, Schema, Types, model } from "mongoose";
import { IUserActivity } from "./userActivity_model";
export interface IFood extends Document {
  name: string;
  calories: number;
  nutritionValues: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  userActivities: Types.Array<IUserActivity["_id"]>;
  createdAt: Date;
}

const foodSchema = new Schema<IFood>({
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
  userActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserActivity",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodModel = model<IFood>("Food", foodSchema);

export default FoodModel;
