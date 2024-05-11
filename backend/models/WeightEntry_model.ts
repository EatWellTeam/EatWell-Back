import { Document, Schema, Types, model } from "mongoose";

export interface IWeightEntry extends Document {
  weight: number;
  userActivity: Types.ObjectId;
  createdAt: Date;
}

const weightEntrySchema = new Schema<IWeightEntry>({
  weight: {
    type: Number,
    required: true,
  },
  userActivity: {
    type: Schema.Types.ObjectId,
    ref: "UserActivity",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WeightEntryModel = model<IWeightEntry>("WeightEntry", weightEntrySchema);

export default WeightEntryModel;
