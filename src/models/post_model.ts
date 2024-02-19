import { Document, Schema, Types, model } from "mongoose";

export interface IPost extends Document {
  user: Types.ObjectId;
  userActivity: Types.ObjectId;
  title: string;
  body: string;
  comments: string[];
  likes: string[];
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userActivity: {
    type: Schema.Types.ObjectId,
    ref: "UserActivity",
    required: true,
  },
  title: { type: String, required: true, min: 4 },
  body: { type: String, required: true },
  comments: { type: [String], required: false },
  likes: { type: [String], required: false },
  createdAt: { type: Date, default: Date.now },
});

const postModel = model<IPost>("Post", postSchema);
export default postModel;
