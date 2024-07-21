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
}
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await request(app).post("/auth/register").send(User); 
  const response = await request(app).post("/auth/login").send(User);
  const user_id= response.body.user_id;
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
    const res = await request(app).put("/userActivity/updateWeight").send({userId: '669cd2e7a2f16c9f3fc83d17', weight: 70});
    expect(res.status).toBe(200);
  });

});

