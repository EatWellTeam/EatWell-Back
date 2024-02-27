import request from "supertest";
import mongoose from "mongoose";
import appPromise from "../app";
import UserActivity from "../models/userActivity_model";
import { Express } from "express";
import { createUser } from "./auth.test";
import UserModel, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
let app: Express;
let userDocument: IUser;
let updateUser: IUser;
const user = {
  email: "kuku@gmail.com",
  password: "123",
};

let accessToken: Promise<string>;
beforeAll(async () => {
  app = await appPromise();
  console.log("------User Test Start------");
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  accessToken = await createUser(user);
  userDocument = await UserModel.findOne({ email: user.email });
  console.log("userDocument password", userDocument.password);
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------User Test End------");
});

describe("User for update password Tests", () => {
  test("change user password", async () => {
    const response = await request(app)
      .put(`/user/password/${userDocument._id}`)
      .send({ password: "123", newPassword: "1234" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    console.log("userDocument new password", userDocument.password);
  });
  test("verify user new password", async () => {
    // Re-fetch the user from the database
    updateUser = await UserModel.findById(userDocument._id);
    console.log("verify new password", updateUser.password);
    const isMatch = await bcrypt.compare("1234", updateUser.password);
    expect(isMatch).toBe(true);
    expect(updateUser.password).not.toBe(userDocument.password);
  });
  test("login with new password", async () => {
    updateUser = await UserModel.findById(userDocument._id);
    console.log("updateUser", updateUser);
    const response = await request(app)
      .post("/auth/login")
      .send({ email: updateUser.email, password: "1234" });
    expect(response.status).toBe(200);
  });
  test("should not change password if old password is incorrect", async () => {
    const response = await request(app)
      .put(`/user/password/${userDocument?._id}`)
      .send({ password: "wrongPassword", newPassword: "1234" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Invalid password");
  });

  test("should not change password if new password is missing", async () => {
    const response = await request(app)
      .put(`/user/password/${userDocument?._id}`)
      .send({ password: "123" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
  });

  test("should not verify password if email is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "1234" });
    expect(response.status).toBe(400);
  });

  test("should not verify password if password is incorrect", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "wrongPassword" });
    expect(response.status).toBe(401);
  });
});
