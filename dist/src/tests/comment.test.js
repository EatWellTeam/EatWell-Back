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
let app;
const postId = "65a69b520e7d1666b2dcc49b";
const userId = "5f9f5b3b1c1d4cafa959dcf2";
// let commentModel;
let commentId;
let accessToken;
const user = {
    email: "testUser@test.com",
    password: "1234567890"
};
const comment1 = {
    user: userId,
    post: `${postId}`,
    body: 'test comment',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Comment Test Start------');
    yield comments_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Comment Test End------');
}));
describe('Comment Test', () => {
    test('TEST 1: Create Comment : /posts/comments/:id/createComment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/comments/${postId}/createComment`)
            .send(comment1).set('Authorization', `JWT ${accessToken}`);
        expect(response.status).toBe(201);
        console.log(response.body);
        expect(response.body.user).toBe(comment1.user);
        expect(response.body.post).toBe(comment1.post);
        expect(response.body.body).toBe(comment1.body);
        commentId = response.body._id;
    }));
    test('TEST 2: Get Comment By Id : /posts/comments/:id/getComment/:postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/comments/${commentId}/getComment/${postId}`)
            .send(comment1).set('Authorization', `JWT ${accessToken}`);
        expect(response.status).toBe(200);
        console.log(response.body);
        // commentModel = response.body;
        expect(response.body).toMatchObject(comment1);
    }));
    test('TEST 3: PUT Comment By Id : /posts/comments/:id/updateComment/:postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/posts/comments/${commentId}/updateComment/${postId}`).send({ body: 'updated comment' }).set('Authorization', `JWT ${accessToken}`);
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body.body).toBe('updated comment');
    }));
});
//# sourceMappingURL=comment.test.js.map