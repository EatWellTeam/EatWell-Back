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
      test("TEST 2: PUT /:id/update empty DB", async () => {
        const response = await request(app).put(`/posts/65a3f0c6c1d4cafa959dcf32/update`).send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId});
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual("No posts found!");
     
      

      });
      test("TEST 3: POST /add-post", async () => {
        const response = await request(app).post('/posts/add-post').send(post1);
        expect(response.statusCode).toEqual(200);
        
        const responseObject = JSON.parse(response.text);
        expect(responseObject.post.user).toEqual(post1.user.toHexString());
        postId = responseObject.post._id;
      

      })
      test("TEST 4: GET /:id", async () => {
        const response = await request(app).get(`/posts/${postId}`);
        expect(response.statusCode).toEqual(200);
        
        const responseObject = JSON.parse(response.text);
          expect(responseObject.post.user).toEqual(post1.user.toHexString());
          expect(responseObject.post.title).toEqual(post1.title);
          expect(responseObject.post.body).toEqual(post1.body);
      });
      test("TEST 5: GET /allPosts", async () => {
        const response = await request(app).get(`/posts/allPosts`);
        expect(response.statusCode).toEqual(200);
        
        const responseObject = JSON.parse(response.text);
        expect(responseObject.posts[0].user).toEqual(post1.user.toHexString());
        expect(responseObject.posts[0].title).toEqual(post1.title);
        expect(responseObject.posts[0].body).toEqual(post1.body);
      });

      test("TEST 6:GET /:id unExisted post", async () => {
        const response = await request(app).get(`/posts/65a3f0c6c1d5cafa959dcf32`);
        expect(response.statusCode).toEqual(500);

    });
    test("TEST 7:PUT /:id/update", async () => {
      const response = await request(app).put(`/posts/${postId}/update`).send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId});
      expect(response.statusCode).toEqual(200);
      const responseObject = JSON.parse(response.text);
      expect(responseObject.updatedPost.title).toEqual("updated title");
      expect(responseObject.updatedPost.body).toEqual("updated body");
      expect(responseObject.updatedPost.comments[0]).toEqual(commentsId.toHexString());
      expect(responseObject.updatedPost.likes[0]).toEqual(likesId.toHexString());
    });
    test ("TEST 8:PUT /:id/update unExisted post", async () => {
      const response = await request(app).put(`/posts/65a3f0c6c1d5cafa959dcf32/update`).send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId});
      expect(response.statusCode).toEqual(500);
      expect(response.text).toEqual("No such post with this id!");
    });
      
    test("TEST 9: DELETE /:id", async () => {
      const response = await request(app).delete(`/posts/${postId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.text).toEqual("Post deleted successfully!");
    });
    test("TEST 10: DELETE /:id unExisted post", async () => {
      const response = await request(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`);
      expect(response.statusCode).toEqual(500);
      expect(response.text).toEqual("No such post with this id!");
    });
  
});

