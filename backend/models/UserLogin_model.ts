import { Schema, model } from "mongoose";

const userLoginSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserLoginModel = model("UserLogin", userLoginSchema);

export default UserLoginModel;
