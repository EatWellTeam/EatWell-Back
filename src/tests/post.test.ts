
import appPromise from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post from '../models/post_model';
import UserModel from '../models/user_model';
let app: Express;
let accessToken: string;
let postId: string;
const user = {
  email: "testUser@test.com",
  password: "1234567890"

};
const user2 = {
  email: "testUser@test.com"
}
const user3 = {
  email: "test@test.com",
  password: "1234567890"
}
beforeAll(async () => {
  app = await appPromise();
  console.log('------Post Test Start------');
  await Post.deleteMany();
  await UserModel.deleteMany();

  await request(app).post("/auth/register").send(user);  //register user
  
  const response = await request(app).post("/auth/login").send(user); //user logged in
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
    test("test register for missing email / password", async () => { 
      const response = await request(app).post("/auth/register").send(user2);
      expect(response.statusCode).toEqual(400);
      expect(response.text).toEqual("Missing email or password");
      
    });
    test("test register for existing email", async () => {
      const response = await request(app).post("/auth/register").send(user);
      expect(response.statusCode).toEqual(409);
      expect(response.text).toEqual("Email Already Used");
    });
    test("test register user", async () => {
      const response = await request(app).post("/auth/register").send(user3);  //user 3 register
      expect(response.statusCode).toEqual(201);
    });
    test("test login for missing email / password", async () => {
   
      user3.email = undefined;
      const response2 = await request(app).post("/auth/login").send(user3); //user3 didn't login
      expect(response2.statusCode).toEqual(400);
      expect(response2.text).toEqual("missing email or password");
      user3.email = "test@test.com";
    });
    test("test login for incorrect password", async () => {
      user3.password = "123456789";
      const response = await request(app).post("/auth/login").send(user3);
      expect(response.statusCode).toEqual(401);
      expect(response.text).toEqual("email or password incorrect");
      user3.password = "1234567890";
      
    });
    test("test login for incorrect email", async () => {
      user3.email = "kuku123@gmail.com";
      const response = await request(app).post("/auth/login").send(user3);
      expect(response.statusCode).toEqual(401);
      expect(response.text).toEqual("email or password incorrect");
      user3.email = "test@test.com";
      
    });
    test("test for logout with no token", async () => {
      const response = await request(app).get("/auth/logout");
      expect(response.statusCode).toEqual(401);
     
    });
    test("test logout", async () => {
      const response = await request(app).get("/auth/logout").set('Authorization', `JWT ${accessToken}`);
      console.log("logout response:");
      console.log(response.text);
      expect(response.statusCode).toEqual(200);
    });
    
    test("test login for correct email and password", async () => {
      const response = await request(app).post("/auth/login").send(user);  //user logged in
      expect(response.statusCode).toEqual(200);
      accessToken = response.body.accessToken;
    });




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


