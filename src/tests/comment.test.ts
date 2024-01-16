import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import CommentModel from '../models/comments_model';
import PostModel from '../models/post_model';

let app: Express;
const postId = PostModel.findOne({}).then((post) => post?._id);
const user = PostModel.findById(postId).then((post) => post?.user);
const post = PostModel.findById(postId);
beforeAll(async () => {
  app = await appPromise();
  console.log('------Comment Test Start------');
  await CommentModel.deleteMany();
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log('------Comment Test End------');
});

describe('Comment Test', () => {
  test('Create Comment : /posts/:postid', async () => {
    const response = await request(app)
      .post(`posts/${postId}/createComment`)
      .send({
        user:user,
        post:post,
        body: 'test comment',
      });
    expect(response.status).toBe(200);
    console.log(response.body);
 
 
    
  });
});