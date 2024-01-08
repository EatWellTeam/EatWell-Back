import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  id?: string;
  email: string;
  password: string;
  refreshTokens?: string[];
  createdAt: Date;
  profileImage: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
    required: false,
  },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
