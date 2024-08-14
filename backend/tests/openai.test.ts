// openAI.test.ts
import env from "dotenv";
import { Express } from "express";
import initApp from "../app";
import mongoose from "mongoose";
import request from "supertest";

import { Message, MessageContent } from "../services/openAI";
env.config();

const imageURL =
  "https://img.hellofresh.com/f_auto,fl_lossy,q_auto,w_1200/hellofresh_s3/image/shawarma-au-poulet-d0f073a1.jpg";

const messageContent: MessageContent[] = [
  {
    type: "image_url",
    image_url: { url: imageURL },
  },
];

const messages: Message[] = [
  {
    role: "user",
    content: messageContent,
  },
];
let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("------OpenAI API Tests Start------");
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------OpenAI API Tests End------");
});

describe("fetchChatCompletion", () => {
  test("fetches chat completion successfully", async () => {
    const response = await request(app)
      .post("/middleware/process")
      .send(messages)
      .timeout(30000); // 30 seconds timeout

    expect(response.status).toBe(200);

    console.log("response from API: \n", response.body);
  }, 35000);
});
