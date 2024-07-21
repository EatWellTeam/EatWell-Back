import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  id?: string;
  email: string;
  fullName: string;
  password: string;
  dateOfBirth?: Date;
  refreshTokens?: string[];
  createdAt: Date;
  
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
  
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
