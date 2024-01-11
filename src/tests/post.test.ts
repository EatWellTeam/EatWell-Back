import request from "supertest";
import initApp from "../app";
import mongoose, { Types } from "mongoose";
import { Express } from "express";
import Post from "../models/post_model";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  await mongoose.connection.close();
});

const testPost = {
  user: "659e61bc90bcb1c185eb6932",
  body: "Test post body",
};

describe("Post model tests", () => {
  test("Create a new post", async () => {
    try {
      const response = await request(app).post("/posts/post").send(testPost);
      expect(response.statusCode).toBe(201);
    } catch (err) {
      console.log(err);
    }
  });
});
