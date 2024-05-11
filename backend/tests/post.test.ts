import appPromise from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import Post from "../models/Food_model";
import UserModel from "../models/user_model";
import UserActivity from "../models/userActivity_model";
import { createUser } from "./auth.test";
import CommentModel from "../models/WeightEntry_model";
import path from "path";
let accessToken: string;
let app: Express;
let postId: string;
const user = {
  email: "test@test.com",
  password: "1234567890",
};

let userId = new mongoose.Types.ObjectId().toHexString();
console.log("userId-1", userId);
const post1 = {
  user: userId,
  body: "This is a test post",
  comments: [],
  likes: [],
};
const postForNotRegisteredUser = {
  user: new mongoose.Types.ObjectId().toHexString(),
  body: "This is a test post",
  comments: [],
  likes: [],
};

beforeAll(async () => {
  app = await appPromise();
  console.log("------Post Test Start------");

  await Post.deleteMany();
  await CommentModel.deleteMany();
  await UserActivity.deleteMany();
  await UserModel.deleteMany();
  accessToken = await createUser(user);
  userId = await UserModel.findOne({ email: user.email }).then((user) => {
    return user._id.toHexString();
  });
  post1.user = userId;
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log("------Post Test End------");
});

describe("Post Module", () => {
  test("TEST 1: GET /post/:id empty DB", async () => {
    const response = await request(app)
      .get(`/posts/65a3f0c6c1d4cafa959dcf32`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Not Found");
  });

  test("TEST 2: PUT /:id/update empty DB", async () => {
    const response = await request(app)
      .put(`/posts/65a3f0c6c1d4cafa959dcf32/update`)
      .send({ body: "updated body" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Not Found");
  });

  test("TEST 3: POST /add-post", async () => {
    const response = await request(app)
      .post("/posts/addPost")
      .send(post1)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(201);
    postId = response.body._id;
  });

  test("TEST 6: GET /:id", async () => {
    const response = await request(app)
      .get(`/posts/${postId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(post1.user);
    expect(response.body.body).toEqual(post1.body);
  });

  test("TEST 9: GET /allPosts", async () => {
    const response = await request(app)
      .get(`/posts/allPosts`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);

    expect(response.body[0].user).toEqual(post1.user);
    expect(response.body[0].body).toEqual(post1.body);
  });

  test("TEST 10:GET /:id unExisted post", async () => {
    const response = await request(app)
      .get(`/posts/65a3f0c6c1d5cafa959dcf32`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Not Found");
  });
  test("TEST 11:PUT /:id/update", async () => {
    const response = await request(app)
      .put(`/posts/${postId}/update`)
      .send({ body: "updated body" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.body).toEqual("updated body");
  });

  test("TEST 12:PUT /:id/update unExisted post", async () => {
    const response = await request(app)
      .put(`/posts/65a3f0c6c1d5cafa959dcf32/update`)
      .send({ body: "updated body" })
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Not Found");
  });
  test("TEST 13: DELETE /:id unExisted post", async () => {
    const response = await request(app)
      .delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
  });
  test("TEST 14: DELETE /:id", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Deleted successfully");
  });
  test("TEST 15: DELETE /:id empty DB", async () => {
    const response = await request(app)
      .delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
  });

  test("TEST 16: Post - User not found", async () => {
    const response = await request(app)
      .post("/posts/addPost")
      .send(postForNotRegisteredUser)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.text).toEqual("User not found");
  });

  test("TEST 17: Post - with picture", async () => {
    const userExists = await UserModel.exists({ _id: post1.user });
    console.log("userExists", userExists);
    const response = await request(app)
      .post("/posts/addPost")
      .set("Authorization", `JWT ${accessToken}`)
      .field("user", post1.user)
      .field("body", "This is a test post")
      .attach("file", path.join(__dirname, "batman.png"));
    expect(response.statusCode).toEqual(201);
    postId = response.body._id;
  });
  test("TEST 18: DELETE /:id with picture", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Deleted successfully");
  });
});

export default post1;
