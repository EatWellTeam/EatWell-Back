import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;


const User ={
  email: "kuku@gmail.com",
  fullName: "kuku",
  dateOfBirth: "1990-01-01",
  password: "123",
  gender: "male",
  age: 30,
  weight: 80,
  height: 180,
  activityLevel: "sedentary",
  goal: "lose",

}
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
 
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe("User Activity", () => {
  test("should return all useres activity", async () => {
    const res = await request(app).get("/userActivity");
    expect(res.status).toBe(200);
  });
  test("update user weight", async () => {  
    await request(app).post("/auth/register").send(User); 
    const response = await request(app).post("/auth/login").send(User);
    const user_id= response.body._id;
    const res = await request(app).put("/userActivity/updateWeight").send({userId: user_id, weight: 90});
    expect(res.status).toBe(200);
  });

});

