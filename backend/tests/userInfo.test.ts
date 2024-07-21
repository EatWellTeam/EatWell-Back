import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel, { IUser } from "../models/user_model";
import path from "path";
let app: Express;
let userDocument: IUser;
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
  console.log("------User info Test Start------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  accessToken = await createUser(user);
  userDocument = await UserModel.findOne({ email: user.email });
  await request(app)
    .post(`/user/picture/${userDocument._id}`)
    .set("Authorization", `JWT ${accessToken}`)
    .attach("file", path.join(__dirname, "batman.png"));
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
  test("unauthorized get user by id", async () => {
    const response = await request(app).get(`/user/${userDocument._id}`);
    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });

  test("user not found", async () => {
    const unknownUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/user/${unknownUserId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  test("Invalid user token", async () => {
    const response = await request(app)
      .get(`/user/${userDocument._id}`)
      .set("Authorization", `JWT invalidToken`);
    expect(response.status).toBe(403);
    expect(response.text).toBe("invalid access token");
  });

  test("get all users", async () => {
    const response = await request(app)
      .get("/user/all")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
  });
});
