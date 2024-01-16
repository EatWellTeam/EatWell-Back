import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import CommentModel from '../models/comments_model';
import PostModel from '../models/post_model';

let app: Express;
let postId:string;
// let post:mongoose.Types.ObjectId;

beforeAll(async () => {
  app = await appPromise();
  console.log('------Comment Test Start------');
  await CommentModel.deleteMany();
   postId = (await PostModel.findOne({}).then((post) => post?._id)).toHexString();
  //  post = await PostModel.findById(postId).then((post) => post?._id);

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
     const userModel = "5f9f5b3b1c1d4cafa959dcf2";
    // const userModel = PostModel.findById(postId).populate('user');
    console.log("------USER------");
    console.log(userModel);
     comment1 = {
      user:userModel,
      post:`${postId}`,
      body: 'test comment',
    };
  });
  

  test('TEST 1: Create Comment : /posts/comments/:id/createComment', async () => {
    const response = await request(app)
      .post(`/posts/comments/${postId}/createComment`)
      .send(comment1);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toMatchObject(comment1);
 
  });
  test('TEST 2: Get Comment : /posts/comments/:id', async () => {
    const response = await request(app)
      .get(`/posts/comments/${postId}/getComment`);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toMatchObject(comment1);
  });
});