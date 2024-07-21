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
  ingredients: [
    "1 cup of mixed greens",
    "6 cherry tomato halves",
    "5 pieces of yellow bell pepper",
    "1 cup ofsweet potato fries",
    "5 slices of seasoned chicken breast",
  ],
};

const ingredients2 = {
  ingredients: [
    "1 steak",
    "1 cup of mixed greens",
    "200 gram potato",
    "2 pieces of bread",
    "1 cup of milk",
  ],
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
    expect(response.body.nutritionData).toHaveProperty("calories");
    expect(response.body.nutritionData).toHaveProperty("totalWeight");
    expect(response.body.nutritionData).toHaveProperty("totalNutrients");
    expect(response.body.nutritionData).toHaveProperty("totalDaily");
  });

  test("another test get nutrition", async () => {
    const response = await request(app)
      .post("/nutrition/get-nutrition")
      .send(ingredients2);

    console.log("response from Edamam API: \n", response.body);
    expect(response.status).toBe(200);
    expect(response.body.nutritionData).toHaveProperty("calories");
    expect(response.body.nutritionData).toHaveProperty("totalWeight");
    expect(response.body.nutritionData).toHaveProperty("totalNutrients");
    expect(response.body.nutritionData).toHaveProperty("totalDaily");
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
