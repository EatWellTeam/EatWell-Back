import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel, { IUser } from "../models/user_model";
import Post from "../models/Food_model";
import Comment from "../models/WeightEntry_model";

let app: Express;
let userToDelete: IUser;
const user = {
  email: "kuku@gmail.com",
  password: "123",
};
let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------ Test Start For Delete User------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();
  accessToken = await createUser(user);
  userToDelete = await UserModel.findOne({ email: user.email });
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------Test End For Delete User------");
});

describe("User for delete Tests", () => {
  test("should not delete a user without authorization", async () => {
    const response = await request(app).delete(`/user/${userToDelete._id}`);
    expect(response.status).toBe(401);
  });
  test("delete user", async () => {
    const response = await request(app)
      .delete(`/user/${userToDelete._id}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    const deletedUser = await UserModel.findById(userToDelete._id);
    expect(deletedUser).toBeNull();
  });
  test("verify posts of user deleted", async () => {
    const posts = await Post.find({ user: userToDelete._id });
    expect(posts.length).toBe(0);
  });
  test("verify comments of user deleted", async () => {
    const comments = await Comment.find({ user: userToDelete._id });
    expect(comments.length).toBe(0);
  });
  test("verify userActivity of user deleted", async () => {
    const userActivity = await UserActivity.find({ user: userToDelete._id });
    expect(userActivity.length).toBe(0);
  });

  test("user not existed to be deleted", async () => {
    const response = await request(app)
      .delete(`/user/${userToDelete._id}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(404);
  });
});
