import mongoose from "mongoose";
import { IUser } from "./user_model";
import { IPost } from "./post_model";
import { IComment } from "./comments_model";

export interface IUserActivity extends mongoose.Document {
  user: IUser["_id"];
  email: string;
  profileImage: string;
  post: IPost["_id"];
  comment: IComment["_id"];
  createdAt: Date;
}

const userActivitySchema = new mongoose.Schema<IUserActivity>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  profileImage: { type: String, required: false },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  comment:{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"},
  createdAt: { type: Date, default: Date.now },
});

const UserActivityModel = mongoose.model<IUserActivity>("UserActivity",userActivitySchema);

export default UserActivityModel;