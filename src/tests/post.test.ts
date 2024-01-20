
import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post from '../models/post_model';
import { authUser } from './auth.test';
import UserModel from "../models/user_model";
let accessToken: string;
let app: Express;

let postId: string;
const user = {
  email: "test@test.com",
  password: "1234567890"
}
beforeAll(async () => {
  app = await appPromise();
  console.log('------Post Test Start------');
  await Post.deleteMany();
  // Use the function to run tests and get the token
  await authUser();
  await UserModel.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);  //register user
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;

});
afterAll(async () => {
  await mongoose.disconnect();
  console.log('------Post Test End------');
});

describe('Post Module', () => { 
  const userId = new mongoose.Types.ObjectId().toHexString();
  const commentsId = new mongoose.Types.ObjectId().toHexString();
  const likesId = new mongoose.Types.ObjectId().toHexString();
  const post1 = {
    user: userId,
    title: 'Test Post',
    body: 'This is a test post',
    comments:commentsId,
    likes:likesId
    
  };
   



      test("TEST 1: GET /post/:id empty DB", async () => {
        const response = await request(app)
        .get(`/posts/65a3f0c6c1d4cafa959dcf32`)
         .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
       expect(response.body.message).toEqual("Not Found");
      });
      test("TEST 2: PUT /:id/update empty DB", async () => {
        const response = await request(app)
        .put(`/posts/65a3f0c6c1d4cafa959dcf32/update`)
        .send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId})
        .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        console.log(response.text);
        expect(response.body.message).toEqual("Not Found");
     
      

      });
      test("TEST 3: POST /add-post", async () => {
        const response = await request(app)
        .post('/posts/addPost').send(post1)
        .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(201);
        postId = response.body._id;
        
      })
      test("TEST 4: GET /:id", async () => {
        const response = await request(app)
        .get(`/posts/${postId}`)
        .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user).toEqual(post1.user);
        expect(response.body.title).toEqual(post1.title);
        expect(response.body.body).toEqual(post1.body);
       
      });
      test("TEST 5: GET /allPosts", async () => {
        const response = await request(app).get(`/posts/allPosts`) .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
      
          expect(response.body[0].user).toEqual(post1.user);
          expect(response.body[0].title).toEqual(post1.title);
          expect(response.body[0].body).toEqual(post1.body);
        
      
      });

      test("TEST 6:GET /:id unExisted post", async () => {
        const response = await request(app)
        .get(`/posts/65a3f0c6c1d5cafa959dcf32`) 
        .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");

    });
    test("TEST 7:PUT /:id/update", async () => {
      const response = await request(app)
      .put(`/posts/${postId}/update`)
      .send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId})
      .set('Authorization', `JWT ${accessToken}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toEqual("updated title");
      expect(response.body.body).toEqual("updated body");
      expect(response.body.comments[0]).toEqual(commentsId);
      expect(response.body.likes[0]).toEqual(likesId);
    });
    
    test ("TEST 8:PUT /:id/update unExisted post", async () => {
      const response = await request(app)
      .put(`/posts/65a3f0c6c1d5cafa959dcf32/update`)
      .send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId})
      .set('Authorization', `JWT ${accessToken}`);
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Not Found");
    });
    test("TEST 9: DELETE /:id unExisted post", async () => {
      const response = await request(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
      .set('Authorization', `JWT ${accessToken}`);
      expect(response.statusCode).toEqual(404);

   
    });
    test("TEST 10: DELETE /:id", async () => {
      const response = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `JWT ${accessToken}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Deleted successfully");
    });
    test("TEST 11: DELETE /:id empty DB", async () => {
      const response = await request(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`) .set('Authorization', `JWT ${accessToken}`);
      expect(response.statusCode).toEqual(404);
      
    });
});


