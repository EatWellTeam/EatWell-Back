import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  id?: string;
  email: string;
  fullName: string;
  gender: string;
  age?: number;
  password: string;
  dateOfBirth?: Date;
  refreshTokens?: string[];
  createdAt: Date;
  profileImage: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: { type: String, required: true },
  age: { type: Number, required: true },

  dateOfBirth: {
    type: Date,
    required: false,
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
