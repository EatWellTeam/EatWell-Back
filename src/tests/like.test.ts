// import appPromise from '../app';
// import request from 'supertest';
// import mongoose from 'mongoose';
// import { Express } from 'express';
// import { authUser } from './auth.test';
// import LikeModel from '../models/likes_model';
// import UserModel from "../models/user_model";
// import postId from './post.test';
// let app: Express;
// const user = {
//   email: "testUser@test.com",
//   password: "1234567890"

// };
// beforeAll(async () => {
//   app = await appPromise();
//   console.log("beforeAll");
//   LikeModel.deleteMany();
//   UserModel.deleteMany({ email: user.email });
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// const testLike = {
//   user: "659e61bc90bcb1c185eb6932",
//   post: "659ff1f0c9b3ec7276edea39",
// };

// describe("Post model tests", () => {
//   authUser();
//   test("Create a new like on post", async () => {
//     try {
//       const response = await request(app).post("/likes/post").send(testLike);
//       expect(response.statusCode).toBe(201);
//     } catch (err) {
//       console.log(err);
//     }
//   });
// });
