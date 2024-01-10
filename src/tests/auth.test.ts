import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(409);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  //   test("Test refresh token", async () => {
  //     const response = await request(app)
  //       .get("/auth/refresh")
  //       .set("Authorization", "JWT " + refreshToken)
  //       .send();
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.accessToken).toBeDefined();
  //     expect(response.body.refreshToken).toBeDefined();

  //     const newAccessToken = response.body.accessToken;
  //     newRefreshToken = response.body.refreshToken;

  //     const response2 = await request(app)
  //       .get("/student")
  //       .set("Authorization", "JWT " + newAccessToken);
  //     expect(response2.statusCode).toBe(200);
  //   });

  //   test("Test double use of refresh token", async () => {
  //     const response = await request(app)
  //       .get("/auth/refresh")
  //       .set("Authorization", "JWT " + refreshToken)
  //       .send();
  //     expect(response.statusCode).not.toBe(200);

  //     //verify that the new token is not valid as well
  //     const response1 = await request(app)
  //       .get("/auth/refresh")
  //       .set("Authorization", "JWT " + newRefreshToken)
  //       .send();
  //     expect(response1.statusCode).not.toBe(200);
  //   });
});
