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
  console.log("------User edit picture start test------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  accessToken = await createUser(user);
  userDocument = await UserModel.findOne({ email: user.email });
  console.log("userDocument password", userDocument.password);
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User edit picture end start------");
});
describe("User edit picture tests", () => {
  test("Update user picture", async () => {
    const response = await request(app)
      .put(`/user/picture/${userDocument._id}`)
      .set("Authorization", `JWT ${accessToken}`)
      .attach("file", path.join(__dirname, "OIP.jpeg"));
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile picture updated");
  });
  test("Update user picture with no picture", async () => {
    const response = await request(app)
      .put(`/user/picture/${userDocument._id}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("No picture uploaded");
  });
  test("Update user picture with invalid file type", async () => {
    const response = await request(app)
      .put(`/user/picture/${userDocument._id}`)
      .set("Authorization", `JWT ${accessToken}`)
      .attach("file", path.join(__dirname, "invalidfile.txt"));
    expect(response.status).toBe(415);
    expect(response.body.error).toBe("Invalid file type");
  });

  test("Update user picture with no file", async () => {
    const response = await request(app)
      .put(`/user/picture/${userDocument._id}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("No picture uploaded");
  });

  test("Update user picture with invalid user ID", async () => {
    const invalidUserId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .put(`/user/picture/${invalidUserId}`)
      .set("Authorization", `JWT ${accessToken}`)
      .attach("file", path.join(__dirname, "batman.png"));
    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  test("Update user picture without authorization", async () => {
    try {
      console.log("test without authorization");
      const response = await request(app)
        .put(`/user/picture/${userDocument._id}`)
        .attach("file", path.join(__dirname, "batman.png"));
      console.log("response", response.text, response.status);
      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized");
    } catch (error) {
      console.error(error);
    }
  });
});
