import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel, { IUser } from "../models/user_model";
let app: Express;
let userDocument: IUser;
const user = {
  email: "kuku@gmail.com",
  password: "123",
};

let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------User info Test Start------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  accessToken = await createUser(user);
  userDocument = await UserModel.findOne({ email: user.email });
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User info Test End------");
});

describe("User info Tests", () => {
  test("get user by id", async () => {
    const response = await request(app)
      .get(`/user/${userDocument._id}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("profileImage");
  });
});
