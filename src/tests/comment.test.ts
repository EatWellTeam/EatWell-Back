import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import CommentModel from '../models/comments_model';
import PostModel from '../models/post_model';
import UserModel from '../models/user_model';
let app: Express;
let postId:string;
let commentId:string;
let accessToken: string;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
};
beforeAll(async () => {
  app = await appPromise();
  console.log('------Comment Test Start------');
  await CommentModel.deleteMany();
  await UserModel.deleteMany({ email: user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
   postId = (await PostModel.findOne({}).then((post) => post?._id)).toHexString();
  commentId = (await CommentModel.findOne({}).then((comment) => comment?._id)).toHexString();
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log('------Comment Test End------');
});

describe('Comment Test', () => {

  interface Comment {
    user: string;
    post: string;
    body: string;
  }
  let comment1: Comment;
  beforeEach(async () => {
     const userId = "5f9f5b3b1c1d4cafa959dcf2";
   
    console.log("------USER------");
    console.log(userId);
     comment1 = {
      user:userId,
      post:`${postId}`,
      body: 'test comment',
    };
  });
  

  test('TEST 1: Create Comment : /posts/comments/:id/createComment/:commentId', async () => {
    const response = await request(app)
      .post(`/posts/comments/${postId}/createComment`)
      .send(comment1).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toMatchObject(comment1);
 
  });
  test('TEST 2: Get Comment : /posts/comments/:id', async () => {
    const response = await request(app)
      .get(`/posts/comments/${postId}/getComment/${commentId}`);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toMatchObject(comment1);
  });
});