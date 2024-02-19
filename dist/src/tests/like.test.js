// import request from 'supertest';
// import { Express } from 'express';
// import appPromise from '../app';
// let app: Express;
// export async function likePost(user:object,user2:object,accessToken2:string,postId:string){
//   beforeAll(async () => {
//     app = await appPromise();
//   });
//   describe("Like tests", () => {
//     test("TEST 4: POST post not found for add likes", async () => {
//       const response = await request(app)
//       .post(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
//       .set('Authorization', `JWT ${accessToken2}`);
//       expect(response.statusCode).toEqual(404);
//       expect(response.body.message).toEqual("Post not found");
//     });
//     test('TEST 5: DELETE like post not found', async () => {
//       const response = await request(app)
//       .delete(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
//       .set('Authorization', `JWT ${accessToken2}`);
//       expect(response.statusCode).toEqual(404);
//       expect(response.body.message).toEqual("Post not found");
//     });
//     test("TEST 7: Post Like", async () => {
//       const response = await request(app)
//       .post(`/posts/${postId}/like`).send(user2)
//       .set('Authorization', `JWT ${accessToken2}`);
//       expect(response.statusCode).toEqual(200);
//       expect(response.body.message).toEqual("Post liked");
//     });
//     test("TEST 8: DELETE Post Like - Like not found", async () => {
//       const response = await request(app)
//       .delete(`/posts/${postId}/like`).send(user)
//       .set('Authorization', `JWT ${accessToken2}`);
//       expect(response.statusCode).toEqual(402);
//       expect(response.body.message).toEqual("Like not found");
//     });
//     test("TEST 8: DELETE Post Like", async () => {
//       const response = await request(app)
//       .delete(`/posts/${postId}/like`).send(user2)
//       .set('Authorization', `JWT ${accessToken2}`);
//       expect(response.statusCode).toEqual(200);
//       expect(response.body.message).toEqual("Post unliked");
//     });
//   });
// }
//# sourceMappingURL=like.test.js.map