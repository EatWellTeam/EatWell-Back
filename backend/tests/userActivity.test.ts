import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel from "../models/user_model";
import PostModel from "../models/post_model";
import post1 from "./post.test";

let app: Express;
let userId: string;
let userActivityId: string;
let user: { email: string; password: string };
let ObjectId: mongoose.Types.ObjectId;
let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------User Activity Test Start------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  await PostModel.deleteMany();
  user = {
    email: "kuku@gmail.com",
    password: "123",
  };
  accessToken = await createUser(user);
  userId = await UserModel.findOne({ email: user.email }).then((user) => {
    return user?._id.toHexString();
  });
  userActivityId = await UserActivity.findOne({ email: user.email }).then(
    (userActivity) => {
      return userActivity?._id.toHexString();
    }
  );
  post1.user = userId;
  post1.userActivity = userActivityId;
  await request(app)
    .post("/posts/addPost")
    .send(post1)
    .set("Authorization", `JWT ${accessToken}`);

  ObjectId = new mongoose.Types.ObjectId();
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User Activity Test End------");
});

describe("User Activity Test", () => {
  test("should get all user activity", async () => {
    const response = await request(app).get("/user/find/all");
    console.log("all users : ", response.body);
    expect(response.status).toBe(200);
  });

  test("should get user activity by id", async () => {
    const userActivity = await UserActivity.findOne({ email: user.email });
    const response = await request(app).get(`/user/${userActivity?._id}`);
    console.log("User Activity Response : ", response.body);
    expect(response.status).toBe(200);
  });
  test("get posts of user", async () => {
    const response = await request(app).get(`/user/${userId}/posts`);
    console.log("User Posts : ", response.body);
    expect(response.status).toBe(200);
  });
  test("get comments of user", async () => {
    const response = await request(app).get(`/user/${userId}/comments`);
    console.log("User Comments : ", response.body);
    expect(response.status).toBe(200);
  });
  test("user not found for getting posts", async () => {
    const response = await request(app).get(`/user/${ObjectId}/posts`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not found");
  });
  test("user not found for getting comments", async () => {
    const response = await request(app).get(`/user/${ObjectId}/comments`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not found");
  });
  test("should not get user activity by id", async () => {
    const response = await request(app).get(`/user/${ObjectId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found");
  });
});
