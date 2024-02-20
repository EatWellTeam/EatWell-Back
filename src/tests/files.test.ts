import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import appPromise from "../app";
import path from "path";

let app: Express;

beforeAll(async () => {
  app = await appPromise();
  console.log("------File Tests Start------");
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------File Tests End------");
});

describe("File Tests", () => {
  test("upload files", async () => {
    const filePath = path.join(__dirname, "batman.png");
    console.log("filepath:" + filePath);
    try {
      const response = await request(app)
        .post("/file")
        .attach("file", filePath);
      expect(response.status).toBe(200);
      let url = response.body.url;
      console.log(url);
      url = url.replace(/^.*\/\/[^/]+/, "");
      console.log(url);
      const res = await request(app).get(url);
      expect(res.status).toBe(200);
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
});
