import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import CommentModel from '../models/comments_model';
import UserModel from '../models/user_model';
let app: Express;
const postId = "65a69b520e7d1666b2dcc49b";
const userId = "5f9f5b3b1c1d4cafa959dcf2";

 let commentId: string;
let accessToken: string;
const user = {
  email: "testUser@test.com",
  password: "1234567890"

};
const comment1 = {
     
  user:userId,
  post:`${postId}`,
  body: 'test comment',
};
beforeAll(async () => {
  app = await appPromise();
  console.log('------Comment Test Start------');
  await CommentModel.deleteMany();
  await UserModel.deleteMany({ email: user.email });
  await request(app).post("/auth/register").send(user);
  
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;

 
});
afterAll(async () => {
  await mongoose.disconnect();
  console.log('------Comment Test End------');
});

describe('Comment Test', () => {



  test('TEST 1: Create Comment : /posts/comments/:id/createComment', async () => {
    const response = await request(app)
      .post(`/posts/comments/${postId}/createComment`)
      .send(comment1).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    console.log(response.body);
    expect(response.body.user).toBe(comment1.user);
    expect(response.body.post).toBe(comment1.post);
    expect(response.body.body).toBe(comment1.body);
    commentId = response.body._id;
 
  });
  test('TEST 2: Get Comment By Id : /posts/comments/:id/getComment/:postId', async () => {
   
    const response = await request(app)
      .get(`/posts/comments/${commentId}/getComment/${postId}`)
      .send(comment1).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject(comment1);
 
  });
  test('TEST 3: PUT Comment By Id : /posts/comments/:id/updateComment/:postId', async () => {
    const response = await request(app).put(`/posts/comments/${commentId}/updateComment/${postId}`).send({ body: 'updated comment' }).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);

    expect(response.body.body).toBe('updated comment');
  });

  test('TEST 4: GET All Comments : /posts/comments/AllComments', async () => {
    const response = await request(app).get(`/posts/comments/AllComments`).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body[0].body).toBe('updated comment');
  });

  test('TEST 5: DELETE Comment By Id : /posts/comments/:id/deleteComment/:postId', async () => {
    const response = await request(app).delete(`/posts/comments/${commentId}/deleteComment/${postId}`).set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Deleted successfully');
  });
});