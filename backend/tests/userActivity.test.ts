import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";

let app: Express;

let user: { email: string; password: string };
let ObjectId: mongoose.Types.ObjectId;

beforeAll(async () => {
  app = await appPromise();
  console.log("------User Activity Test Start------");
  await UserActivity.deleteMany();
  user = {
    email: "kuku@gmail.com",
    password: "123",
  };

  ObjectId = new mongoose.Types.ObjectId();
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User Activity Test End------");
});

describe("User Activity Test", () => {
  test("should get all user activity", async () => {
    const response = await request(app).get("/userActivity/find/all");
    console.log("all users : ", response.body);
    expect(response.status).toBe(200);
  });

  test("should get user activity by id", async () => {
    const userActivity = await UserActivity.findOne({ email: user.email });
    const response = await request(app).get(
      `/userActivity/${userActivity?._id}`
    );
    console.log("User Activity Response : ", response.body);
    expect(response.status).toBe(200);
  });

  test("should not get user activity by id", async () => {
    const response = await request(app).get(`/userActivity/${ObjectId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found");
  });
});
