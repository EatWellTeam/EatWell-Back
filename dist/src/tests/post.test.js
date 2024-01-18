"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
let postId;
const user = {
    email: "testUser@test.com",
    password: "1234567890"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Post Test Start------');
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Post Test End------');
}));
describe('Post Module', () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    const commentsId = new mongoose_1.default.Types.ObjectId().toHexString();
    const likesId = new mongoose_1.default.Types.ObjectId().toHexString();
    const post1 = {
        user: userId,
        title: 'Test Post',
        body: 'This is a test post',
        comments: commentsId,
        likes: likesId
    };
    test("TEST 1: GET /post/:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/65a3f0c6c1d4cafa959dcf32`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 2: PUT /:id/update empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/65a3f0c6c1d4cafa959dcf32/update`)
            .send({ title: "updated title", body: "updated body", comments: commentsId, likes: likesId })
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(404);
        console.log(response.text);
        expect(response.body.message).toEqual("Not Found");
    }));
    test("TEST 3: POST /add-post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/posts/addPost').send(post1)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(201);
        postId = response.body._id;
    }));
    test("TEST 4: GET /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/${postId}`)
            .set('Authorization', `JWT ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user).toEqual(post1.user);
        expect(response.body.title).toEqual(post1.title);
        expect(response.body.body).toEqual(post1.body);
    }));
    //   test("TEST 5: GET /allPosts", async () => {
    //     const response = await request(app).get(`/posts/allPosts`) .set('Authorization', `JWT ${accessToken}`);
    //     const responseObject = JSON.parse(response.text);
    //     expect(responseObject.posts[0].user).toEqual(post1.user);
    //     expect(responseObject.posts[0].title).toEqual(post1.title);
    //     expect(responseObject.posts[0].body).toEqual(post1.body);
    //   });
    //   test("TEST 6:GET /:id unExisted post", async () => {
    //     const response = await request(app)
    //     .get(`/posts/65a3f0c6c1d5cafa959dcf32`) 
    //     .set('Authorization', `JWT ${accessToken}`);
    //     expect(response.statusCode).toEqual(404);
    //     expect(response.text).toEqual("Not Found");
    // });
    // test("TEST 7:PUT /:id/update", async () => {
    //   const response = await request(app)
    //   .put(`/posts/${postId}/update`)
    //   .send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId})
    //   .set('Authorization', `JWT ${accessToken}`);
    //   expect(response.statusCode).toEqual(200);
    //   const responseObject = JSON.parse(response.text);
    //   expect(responseObject.updatedPost.title).toEqual("updated title");
    //   expect(responseObject.updatedPost.body).toEqual("updated body");
    //   expect(responseObject.updatedPost.comments[0]).toEqual(commentsId);
    //   expect(responseObject.updatedPost.likes[0]).toEqual(likesId);
    // });
    // test ("TEST 8:PUT /:id/update unExisted post", async () => {
    //   const response = await request(app)
    //   .put(`/posts/65a3f0c6c1d5cafa959dcf32/update`)
    //   .send({title:"updated title",body:"updated body",comments:commentsId,likes:likesId})
    //   .set('Authorization', `JWT ${accessToken}`);
    //   expect(response.statusCode).toEqual(404);
    //   expect(response.text).toEqual("No such post with this id!");
    // });
    // test("TEST 9: DELETE /:id unExisted post", async () => {
    //   const response = await request(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`)
    //   .set('Authorization', `JWT ${accessToken}`);
    //   expect(response.statusCode).toEqual(404);
    // });
    // test("TEST 10: DELETE /:id", async () => {
    //   const response = await request(app).delete(`/posts/${postId}`);
    //   expect(response.statusCode).toEqual(200);
    //   expect(response.text).toEqual("Deleted successfully!");
    // });
    // test("TEST 11: DELETE /:id empty DB", async () => {
    //   const response = await request(app).delete(`/posts/65a3f0c6c1d5cafa959dcf32`) .set('Authorization', `JWT ${accessToken}`);
    //   expect(response.statusCode).toEqual(404);
    // });
});
//# sourceMappingURL=post.test.js.map