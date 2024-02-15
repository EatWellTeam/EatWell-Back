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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const post_test_1 = __importDefault(require("./post.test"));
const auth_test_1 = require("./auth.test");
let app;
let postId;
let userId = new mongoose_1.default.Types.ObjectId().toHexString();
let commentId;
let accessTokenComment;
let accessToken;
const user = {
    email: "testUser@test.com",
    password: "1234567890"
};
const userComment = {
    email: "testComment@comment.com",
    password: "1234567890"
};
const userLike = {
    email: "testlike@testlike.com",
    password: "1234567890"
};
const comment1 = {
    user: userId,
    userActivity: userId,
    post: `${postId}`,
    body: 'test comment',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Comment Test Start------');
    yield comments_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield userActivity_model_1.default.deleteMany();
    yield post_model_1.default.deleteMany();
    accessToken = yield (0, auth_test_1.createUser)(user);
    accessTokenComment = yield (0, auth_test_1.createUser)(userComment);
    yield (0, auth_test_1.createUser)(userLike);
    userId = yield user_model_1.default.findOne({ email: user.email }).then((user) => {
        return user._id.toHexString();
    });
    const userIdComment = yield user_model_1.default.findOne({ email: userComment.email }).then((user) => {
        return user._id.toHexString();
    });
    post_test_1.default.user = userId;
    const responsePost = yield (0, supertest_1.default)(app).post("/posts/addPost").send(post_test_1.default).set('Authorization', `JWT ${accessToken}`);
    postId = responsePost.body._id;
    comment1.post = postId;
    comment1.user = userIdComment;
    comment1.userActivity = userIdComment;
    // comment1.user = userId;
    // comment1.userActivity = userId;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Comment Test End------');
}));
describe('Comment Test', () => {
    test('TEST 1: Create Comment - post not found : /posts/comments/:id/createComment', () => __awaiter(void 0, void 0, void 0, function* () {
        const idnotfound = "5f9f5b3b1c1d4cafa959dcf2";
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/comments/${idnotfound}/createComment`)
            .send(comment1).set('Authorization', `JWT ${accessTokenComment}`);
        expect(response.status).toBe(402);
        expect(response.text).toBe('Post not found to add comment');
    }));
    test('TEST 1: Create Comment : /posts/comments/:id/createComment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/comments/${postId}/createComment`)
            .send(comment1).set('Authorization', `JWT ${accessTokenComment}`);
        expect(response.status).toBe(201);
        console.log("response for create a comment");
        console.log(response.body);
        expect(response.body.user).toBe(comment1.user);
        expect(response.body.post).toBe(comment1.post);
        expect(response.body.body).toBe(comment1.body);
        commentId = response.body._id;
    }));
    test('TEST 2: Get Comment By Id : /posts/comments/:id/getComment/:postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/comments/${commentId}/getComment/${postId}`)
            .send(comment1).set('Authorization', `JWT ${accessTokenComment}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(comment1);
    }));
    test('TEST 3: PUT Comment By Id : /posts/comments/:id/updateComment/:postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/posts/comments/${commentId}/updateComment/${postId}`).send({ body: 'updated comment' }).set('Authorization', `JWT ${accessTokenComment}`);
        expect(response.status).toBe(200);
        expect(response.body.body).toBe('updated comment');
    }));
    test('TEST 4: GET All Comments : /posts/comments/AllComments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/comments/AllComments`).set('Authorization', `JWT ${accessTokenComment}`);
        expect(response.status).toBe(200);
        expect(response.body[0].body).toBe('updated comment');
    }));
    // test('TEST 5: DELETE Comment By Id : /posts/comments/:id/deleteComment/:postId', async () => {
    //   const response = await request(app).delete(`/posts/comments/${commentId}/deleteComment/${postId}`).set('Authorization', `JWT ${accessTokenComment}`);
    //   expect(response.status).toBe(200);
    //   expect(response.text).toBe('Deleted successfully');
    // });
    // test('TEST 6: unExisted Comment By Id : /posts/comments/:id/deleteComment/:postId', async () => {
    //   const response = await request(app).delete(`/posts/comments/${commentId}/deleteComment/${postId}`).set('Authorization', `JWT ${accessTokenComment}`);
    //   expect(response.status).toBe(404);
    //   expect(response.text).toBe('Comment not found');
    // });
    // test('TEST 7:unExisted Comment By Id : /posts/comments/:id/updateComment/:postId', async () => {
    //   const response = await request(app).put(`/posts/comments/${commentId}/updateComment/${postId}`).send({ body: 'updated comment' }).set('Authorization', `JWT ${accessTokenComment}`);
    //   expect(response.status).toBe(404);
    //   expect(response.body.message).toBe('Not Found');
    // });
});
//# sourceMappingURL=comment.test.js.map