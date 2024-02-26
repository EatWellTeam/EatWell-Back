import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel from "../models/user_model";
import PostModel from "../models/post_model";

let app: Express;
const user = {
  email: "kuku@gmail.com",
  password: "123",
};

let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------User Activity Test Start------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  await PostModel.deleteMany();

  accessToken = await createUser(user);
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User Activity Test End------");
});

describe("User Tests", () => {
  test("change user password", async () => {
    const user = await UserModel.findOne({ email: "kuku@gmail.com" });
    const response = await request(app)
      .put(`/user/changePassword/${user?._id}`)
      .send({ password: "123", newPassword: "1234" })
      .set("Authorization", `JWT ${await accessToken}`);
    expect(response.status).toBe(200);
  });
  test("verify user new password", async () => {
    const user = await UserModel.findOne({ email: "kuku@gmail.com" });
    const response = await request(app).post("/auth/login").send(user);
    expect(response.status).toBe(200);
  });
});
