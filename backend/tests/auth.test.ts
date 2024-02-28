import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import UserActivity from "../models/userActivity_model";
let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();
  await UserActivity.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const user = {
  email: "testUser@test.com",
  password: "1234567890",
};
const user2 = {
  email: "testUser@test.com",
};

export async function createUser(user: object) {
  await request(app).post("/auth/register").send(user); //register user
  const response = await request(app).post("/auth/login").send(user);
  return response.body.accessToken;
}

let refreshToken: string;
let newRefreshToken: string;

describe("Auth tests", () => {
  console.log("authUser");
  test("TEST 1 test register", async () => {
    const existedUser = await User.findOne({ email: user.email });
    if (!existedUser) {
      const response = await request(app).post("/auth/register").send(user); //register user
      expect(response.statusCode).toEqual(201);
    }
  });
  test("TEST 2 test register for missing email / password", async () => {
    const response = await request(app).post("/auth/register").send(user2);
    expect(response.statusCode).toEqual(400);
    expect(response.text).toEqual("Missing email or password");
  });
  test("TEST 3: test register for existing email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toEqual(409);
    expect(response.text).toEqual("Email Already Used");
  });
  test("TEST 5: test login for missing email / password", async () => {
    user.email = undefined;
    const response2 = await request(app).post("/auth/login").send(user); //user3 didn't login
    expect(response2.statusCode).toEqual(400);
    expect(response2.text).toEqual("missing email or password");
    user.email = "testUser@test.com";
  });
  test("TEST 6: test login for incorrect password", async () => {
    user.password = "123456789";
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toEqual(401);
    expect(response.text).toEqual("email or password incorrect");
    user.password = "1234567890";
  });
  test("TEST 7: test login for incorrect email", async () => {
    user.email = "kuku123@gmail.com";
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toEqual(401);
    expect(response.text).toEqual("email or password incorrect");
    user.email = "testUser@test.com";
  });
  test("TEST 8: test for logout with no token", async () => {
    const response = await request(app).get("/auth/logout");
    expect(response.statusCode).toEqual(401);
  });

  test("TEST 9: test login for correct email and password", async () => {
    const response = await request(app).post("/auth/login").send(user); //user logged in
    expect(response.statusCode).toEqual(200);
    refreshToken = response.body.refreshToken;
  });

  test("TEST 10: Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + newRefreshToken);
    expect(response2.statusCode).toBe(200);
  });
  test("TEST 11: test logout", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", `JWT ${newRefreshToken}`);
    console.log("logout response:");
    console.log(response.text);
    expect(response.statusCode).toEqual(200);
  });
  test("TEST 12: Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });
  test("TEST 13: no refresh token", async () => {
    const response = await request(app).get("/auth/refresh").send();
    expect(response.statusCode).not.toBe(200);
  });
});
