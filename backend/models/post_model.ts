import { Document, Schema, Types, model } from "mongoose";

export interface IPost extends Document {
  user: Types.ObjectId;
  body: string;
  picture: string;
  comments: string[];
  likes: string[];
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  picture: { type: String, required: false },
  comments: { type: [String], required: false },
  likes: { type: [String], required: false },
  createdAt: { type: Date, default: Date.now },
});

const postModel = model<IPost>("Post", postSchema);
export default postModel;
