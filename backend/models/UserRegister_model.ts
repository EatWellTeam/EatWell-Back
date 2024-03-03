import { Schema, model } from "mongoose";

const userRegisterSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = model("User", userRegisterSchema);

export default UserModel;
