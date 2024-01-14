import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post from '../models/post_model';

let app: Express;
let postId: string;
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

  test("TEST 1: POST /add-post", async () => {
    const response = await request(app).post('/add-post').send(post1);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
     expect(responseObject.post.user).toEqual(post1.user.toHexString());
     postId = responseObject.post._id;
  

  })
  test("TEST 2: GET /:id", async () => {
    const response = await request(app).get(`/${postId}`);
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
      expect(responseObject.post._id).toContain(postId);

  });
  test("TEST 3: GET /allPosts", async () => {
    const response = await request(app).get('/allPosts');
     expect(response.statusCode).toEqual(200);
     
     const responseObject = JSON.parse(response.text);
    
        expect(responseObject.posts[0]._id).toContain(postId);
      
     }
  );  
  });

