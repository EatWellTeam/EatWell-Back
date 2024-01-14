import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post from '../models/post_model';

let app: Express;
export let postId: string;
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
  const userId = new mongoose.Types.ObjectId();
  const commentsId = new mongoose.Types.ObjectId();
  const likesId = new mongoose.Types.ObjectId();
  const post1 = {
    user: userId,
    title: 'Test Post',
    body: 'This is a test post',
    comments:commentsId,
    likes:likesId
    
  };
  test("TEST 1: GET /post/:id empty DB", async () => {
    const response = await request(app).get(`/posts/65a3f0c6c1d4cafa959dcf32`);
    expect(response.statusCode).toEqual(500);
    expect(response.text).toEqual("No posts found!");


  });
  test("TEST 2: POST /add-post", async () => {
    const response = await request(app).post('/posts/add-post').send(post1);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
     expect(responseObject.post.user).toEqual(post1.user.toHexString());
     postId = responseObject.post._id;
  

  })
  test("TEST 3: GET /:id", async () => {
    const response = await request(app).get(`/posts/${postId}`);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
      expect(responseObject.post.user).toEqual(post1.user.toHexString());
      expect(responseObject.post.title).toEqual(post1.title);
      expect(responseObject.post.body).toEqual(post1.body);
  });
  test("TEST 4: GET /allPosts", async () => {
    const response = await request(app).get(`/posts/allPosts`);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
     expect(responseObject.posts[0].user).toEqual(post1.user.toHexString());
     expect(responseObject.posts[0].title).toEqual(post1.title);
     expect(responseObject.posts[0].body).toEqual(post1.body);
  });

  test("TEST 5:GET /:id unExisted post", async () => {
    const response = await request(app).get(`/posts/65a3f0c6c1d5cafa959dcf32`);
    expect(response.statusCode).toEqual(500);

});
});

