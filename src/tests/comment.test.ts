import appPromise from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import CommentModel from "../models/comments_model";
import UserModel from "../models/user_model";
import postModel from "../models/post_model";
import UserActivity from "../models/userActivity_model";
import post1 from "./post.test";
import { createUser } from "./auth.test";
let app: Express;
let postId: string;
let userId = new mongoose.Types.ObjectId().toHexString();
const ObjectId = new mongoose.Types.ObjectId();
let commentId: string;
let accessTokenComment: Promise<string>;
let accessToken: Promise<string>;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
};
const userComment = {
  email: "testComment@comment.com",
  password: "1234567890",
};
const userLike = {
  email: "testlike@testlike.com",
  password: "1234567890",
};
const comment1 = {
  user: userId,
  userActivity: userId,
  post: `${postId}`,
  body: "test comment",
};
const invalidComment = {
  user: new mongoose.Types.ObjectId().toHexString(),
  userActivity: new mongoose.Types.ObjectId().toHexString(),
  post: new mongoose.Types.ObjectId().toHexString(),
  body: "test comment",
};
beforeAll(async () => {
  app = await appPromise();
  console.log("------Comment Test Start------");
  await CommentModel.deleteMany();
  await UserModel.deleteMany();
  await UserActivity.deleteMany();
  await postModel.deleteMany();
  accessToken = await createUser(user);
  accessTokenComment = await createUser(userComment);
  await createUser(userLike);

  userId = await UserModel.findOne({ email: user.email }).then((user) => {
    return user._id.toHexString();
  });
  const userIdComment = await UserModel.findOne({
    email: userComment.email,
  }).then((user) => {
    return user._id.toHexString();
  });
  post1.user = userId;
  const responsePost = await request(app)
    .post("/posts/addPost")
    .send(post1)
    .set("Authorization", `JWT ${accessToken}`);
  postId = responsePost.body._id;
  comment1.post = postId;
  comment1.user = userIdComment;
  comment1.userActivity = userIdComment;
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("------Comment Test End------");
});

describe("Comment Test", () => {
  test("TEST 1: Create Comment - post not found : /posts/comments/:id/createComment", async () => {
    const idnotfound = "5f9f5b3b1c1d4cafa959dcf2";
    const response = await request(app)
      .post(`/posts/comments/${idnotfound}/createComment`)
      .send(comment1)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(402);
    expect(response.text).toBe("Post not found to add comment");
  });

  test("TEST 1: Create Comment : /posts/comments/:id/createComment", async () => {
    const response = await request(app)
      .post(`/posts/comments/${postId}/createComment`)
      .send(comment1)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(201);
    console.log("response for create a comment");
    console.log(response.body);
    expect(response.body.user).toBe(comment1.user);
    expect(response.body.post).toBe(comment1.post);
    expect(response.body.body).toBe(comment1.body);
    commentId = response.body._id;
  });
  test("TEST 2: Get Comment By Id : /posts/comments/:id/getComment/:postId", async () => {
    const response = await request(app)
      .get(`/posts/comments/${commentId}/getComment/${postId}`)
      .send(comment1)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject(comment1);
  });
  test("TEST 3: PUT Comment By Id : /posts/comments/:id/updateComment/:postId", async () => {
    const response = await request(app)
      .put(`/posts/comments/${commentId}/updateComment/${postId}`)
      .send({ body: "updated comment" })
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(200);

    expect(response.body.body).toBe("updated comment");
  });

  test("TEST 4: GET All Comments : /posts/comments/AllComments", async () => {
    const response = await request(app)
      .get(`/posts/comments/AllComments`)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(200);
    expect(response.body[0].body).toBe("updated comment");
  });

  test("TEST 5:unExisted Post to add comment : /posts/comments/:id/createComment", async () => {
    const response = await request(app)
      .post(`/posts/comments/${ObjectId}/createComment`)
      .send(comment1)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(402);
    expect(response.text).toBe("Post not found to add comment");
  });
  test("TEST 6: DELETE - Post not found to delete comment : /posts/comments/:id/deleteComment/:postId", async () => {
    const response = await request(app)
      .delete(`/posts/comments/${ObjectId}/deleteComment/${ObjectId}`)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Post not found to delete comment");
  });
  test("TEST 6: DELETE Comment By Id : /posts/comments/:id/deleteComment/:postId", async () => {
    const response = await request(app)
      .delete(`/posts/comments/${commentId}/deleteComment/${postId}`)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Deleted successfully");
  });
  test("TEST 7: unExisted Comment By Id : /posts/comments/:id/deleteComment/:postId", async () => {
    const response = await request(app)
      .delete(`/posts/comments/${ObjectId}/deleteComment/${postId}`)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(404);
    expect(response.text).toBe("Comment not found");
  });
  test("TEST 8:unExisted Comment By Id : /posts/comments/:id/updateComment/:postId", async () => {
    const response = await request(app)
      .put(`/posts/comments/${ObjectId}/updateComment/${postId}`)
      .send({ body: "updated comment" })
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found");
  });
  test("TEST 9: user not found", async () => {
    const response = await request(app)
      .post(`/posts/comments/${postId}/createComment`)
      .send(invalidComment)
      .set("Authorization", `JWT ${accessTokenComment}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("User not found");
  });
});
