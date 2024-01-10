import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post from '../models/post_model';

let app: Express;

beforeAll(async () => {
  app = await appPromise();
  console.log('------Post Test Start------');
  await Post.deleteMany();
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log('------Post Test End------');
});

describe('Post Module', () => {
  const post1 = {
    user:"60d5ecb8b48738259ef1c1b6",
    title: 'Test Post',
    body: 'This is a test post',
    comments: ['cooment1', 'comment2'],
    likes: ['like1', 'like2'],
  };

  test("TEST 1: POST /add-post", async () => {
    const response = await request(app).post('/add-post').send(post1);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);

      expect(responseObject.post).toMatchObject(post1);

  })});
