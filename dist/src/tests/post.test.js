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
exports.postId = void 0;
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Post Test Start------');
    yield post_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Post Test End------');
}));
describe('Post Module', () => {
    const userId = new mongoose_1.default.Types.ObjectId();
    const commentsId = new mongoose_1.default.Types.ObjectId();
    const likesId = new mongoose_1.default.Types.ObjectId();
    const post1 = {
        user: userId,
        title: 'Test Post',
        body: 'This is a test post',
        comments: commentsId,
        likes: likesId
    };
    test("TEST 1: GET /post/:id empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/65a3f0c6c1d4cafa959dcf32`);
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual("No posts found!");
    }));
    test("TEST 2: PUT /:id/update empty DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/posts/65a3f0c6c1d4cafa959dcf32/update`).send({ title: "updated title", body: "updated body", comments: commentsId, likes: likesId });
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual("No posts found!");
    }));
    test("TEST 3: POST /add-post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/posts/add-post').send(post1);
        expect(response.statusCode).toEqual(200);
        const responseObject = JSON.parse(response.text);
        expect(responseObject.post.user).toEqual(post1.user.toHexString());
        exports.postId = responseObject.post._id;
    }));
    test("TEST 4: GET /:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/${exports.postId}`);
        expect(response.statusCode).toEqual(200);
        const responseObject = JSON.parse(response.text);
        expect(responseObject.post.user).toEqual(post1.user.toHexString());
        expect(responseObject.post.title).toEqual(post1.title);
        expect(responseObject.post.body).toEqual(post1.body);
    }));
    test("TEST 5: GET /allPosts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/allPosts`);
        expect(response.statusCode).toEqual(200);
        const responseObject = JSON.parse(response.text);
        expect(responseObject.posts[0].user).toEqual(post1.user.toHexString());
        expect(responseObject.posts[0].title).toEqual(post1.title);
        expect(responseObject.posts[0].body).toEqual(post1.body);
    }));
    test("TEST 6:GET /:id unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/posts/65a3f0c6c1d5cafa959dcf32`);
        expect(response.statusCode).toEqual(500);
    }));
    test("TEST 7:PUT /:id/update", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/posts/${exports.postId}/update`).send({ title: "updated title", body: "updated body", comments: commentsId, likes: likesId });
        expect(response.statusCode).toEqual(200);
        const responseObject = JSON.parse(response.text);
        expect(responseObject.updatedPost.title).toEqual("updated title");
        expect(responseObject.updatedPost.body).toEqual("updated body");
        expect(responseObject.updatedPost.comments[0]).toEqual(commentsId.toHexString());
        expect(responseObject.updatedPost.likes[0]).toEqual(likesId.toHexString());
    }));
    test("TEST 8:PUT /:id/update unExisted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/posts/65a3f0c6c1d5cafa959dcf32/update`).send({ title: "updated title", body: "updated body", comments: commentsId, likes: likesId });
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual("No such post with this id!");
    }));
});
//# sourceMappingURL=post.test.js.map