import { Document, Schema, Types, model } from "mongoose";

export interface IPost extends Document {
  user: Types.ObjectId;
  body: string;
  comments: string[];
  likes: string[];
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
    required: false,
  },
  likes: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostModel = model<IPost>("Post", postSchema);

export default PostModel;
