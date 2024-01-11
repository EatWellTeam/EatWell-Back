import { Document, Schema, Types, model } from "mongoose";

export interface IPost extends Document {
  user: Types.ObjectId;
  body: string;
  comments: [Types.ObjectId];
  likes: [Types.ObjectId];
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
  },
  likes: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postModel = model<IPost>("Post", postSchema);

export default postModel;
