import { Document, Schema, Types, model } from "mongoose";

export interface IComment extends Document {
  user: Types.ObjectId;
  userActivity: Types.ObjectId;
  post: Types.ObjectId;
  body: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userActivity: {
    type: Schema.Types.ObjectId,
    ref: "UserActivity",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = model<IComment>("Comment", commentSchema);

export default CommentModel;
