import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel, { IUser } from "../models/user_model";

let app: Express;
let userToDelete: IUser;
const user = {
  email: "kuku@gmail.com",
  fullName: "kuku",
  dateOfBirth: "1990-01-01",
  password: "123",
  gender: "female",
  age: 25,
  weight: 80,
  height: 180,
  activityLevel: "sedentary",
  goal: "lose",
};
let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------ Test Start For Delete User------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
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
