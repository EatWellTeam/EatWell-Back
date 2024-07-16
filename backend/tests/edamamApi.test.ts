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
    ingredients: ["200g chicken", "100g rice"]

};

const query = {
    query: "chicken"
};
describe("Edamam API tests", () => {
    test("test get nutrition", async () => {
        const response = await request(app).post("/nutrition/get-nutrition").send(ingredients);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("calories");
        expect(response.body).toHaveProperty("totalWeight");
        expect(response.body).toHaveProperty("totalNutrients");
        expect(response.body).toHaveProperty("totalDaily");
    });

    test("test get recipe", async () => {
        const response = await request(app).post("/nutrition/get-recipes").send(query);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("hits");
        expect(response.body.hits.length).toBeGreaterThan(0);
    });
});