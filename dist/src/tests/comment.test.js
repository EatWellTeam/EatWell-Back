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
let commentId;
let accessToken;
const user = {
    email: "testUser@test.com",
    password: "1234567890"
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
    let comment1;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "5f9f5b3b1c1d4cafa959dcf2";
        console.log("------USER------");
        console.log(userId);
        comment1 = {
            user: userId,
            post: `${postId}`,
            body: 'test comment',
        };
    }));
    test('TEST 1: Create Comment : /posts/comments/:id/createComment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/comments/${postId}/createComment`)
            .send(comment1).set('Authorization', `JWT ${accessToken}`);
        expect(response.status).toBe(201);
        console.log(response.body);
        expect(response.body).toMatchObject(comment1);
        commentId = response.body._id;
    }));
    test('TEST 2: Get Comment By Id : /posts/comments/:id/getComment/:commentId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/comments/${postId}/getComment/${commentId}`)
            .send(comment1).set('Authorization', `JWT ${accessToken}`);
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body).toMatchObject(comment1);
    }));
});
//# sourceMappingURL=comment.test.js.map