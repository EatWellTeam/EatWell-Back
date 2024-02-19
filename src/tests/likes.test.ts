import appPromise from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import Post from "../models/post_model";
import UserModel from "../models/user_model";
import UserActivity from "../models/userActivity_model";
import { createUser } from "./auth.test";

let accessToken: string;
let postId: string;
let app: Express;
const user = {
  email: "testlike@testlike.com",
  password: "1234567890",
};
let userId = new mongoose.Types.ObjectId().toHexString();
const post1 = {
  user: userId,
  userActivity: userId,
  title: "Test Post",
  body: "This is a test post",
  comments: [],
  likes: [],
};
beforeAll(async () => {
  app = await appPromise();
  console.log("------Post Test Start------");

  await Post.deleteMany();
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  createUser(user);
  accessToken = await createUser(user);

  userId = await UserModel.findOne().then((user) => {
    return user?._id.toHexString();
  });
  post1.user = userId;
  post1.userActivity = userId;
  const response = await request(app)
    .post("/posts/addPost")
    .send(post1)
    .set("Authorization", `JWT ${accessToken}`);
  postId = response.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("------Post Test End------");
});

describe("Tests for Like Posts", () => {
  test("TEST 4: POST - post not found for add likes", async () => {
    const response = await request(app)
      .post(`/posts/65a3f0c6c1d4cafa959dcf32/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Post not found");
  });
  test("TEST 5: DELETE like post not found", async () => {
    const response = await request(app)
      .delete(`/posts/65a3f0c6c1d4cafa959dcf32/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Post not found");
  });
  test("TEST 7: Post like for unregister user", async () => {
    const noUser = {
      email: "",
      password: "",
    };
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .send(noUser)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(402);
  });
  test("TEST 8: Post like for unAthorized user", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}123`);
    expect(response.statusCode).toEqual(401);
  });
  test("TEST 7: Post Like", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Post liked");
  });
  test("TEST 8: DELETE Post Like", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Post unliked");
  });
  test("TEST 8: DELETE Post Like - Like not found", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}/like`)
      .send(user)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(402);
    expect(response.body.message).toEqual("Like not found");
  });
});
