import { Document, Schema, model } from "mongoose";

type mealTypeEnum = "breakfast" | "lunch" | "dinner" | "snack";

export interface IReciepe extends Document {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  mealType: mealTypeEnum;
  createdAt: Date;
}

const reciepeSchema = new Schema<IReciepe>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReciepeModel = model<IReciepe>("Reciepe", reciepeSchema);

export default ReciepeModel;
