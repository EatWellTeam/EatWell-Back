import request from "supertest";
import initApp from "../app";
import mongoose, { Types } from "mongoose";
import { Express } from "express";
import Post from "../models/likes_model";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  await mongoose.connection.close();
});

const testLike = {
  user: "659e61bc90bcb1c185eb6932",
  post: "659ff1f0c9b3ec7276edea39",
};

describe("Post model tests", () => {
  test("Create a new like on post", async () => {
    try {
      const response = await request(app).post("/likes/post").send(testLike);
      expect(response.statusCode).toBe(201);
    } catch (err) {
      console.log(err);
    }
  });
});
