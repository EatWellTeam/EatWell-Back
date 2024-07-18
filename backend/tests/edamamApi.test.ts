import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  await mongoose.connection.close();
});

const ingredients = {
  ingredients: ["200g chicken", "100g rice"],
  //   ingredients: [
  //     "5 slices of chicken breast",
  //     "1/2 cup of mixed leafy greens",
  //     "5 cherry tomatoes",
  //     "1/4 cup of diced yellow bell pepper",
  //     "20 pieces of sweet potato fries",
  //   ],
};

const query = {
  query: "chicken",
};
describe("Edamam API tests", () => {
  test("test get nutrition", async () => {
    const response = await request(app)
      .post("/nutrition/get-nutrition")
      .send(ingredients);
    console.log("response from Edamam API: \n", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("calories");
    expect(response.body).toHaveProperty("totalWeight");
    expect(response.body).toHaveProperty("totalNutrients");
    expect(response.body).toHaveProperty("totalDaily");
  });

  test("test get recipe", async () => {
    const response = await request(app)
      .post("/nutrition/get-recipes")
      .send(query);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hits");
    expect(response.body.hits.length).toBeGreaterThan(0);
  });
});
