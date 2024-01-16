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
const post_model_1 = __importDefault(require("../models/post_model"));
let app;
let postId;
// let post:mongoose.Types.ObjectId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log('------Comment Test Start------');
    yield comments_model_1.default.deleteMany();
    postId = (yield post_model_1.default.findOne({}).then((post) => post === null || post === void 0 ? void 0 : post._id)).toHexString();
    //  post = await PostModel.findById(postId).then((post) => post?._id);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log('------Comment Test End------');
}));
describe('Comment Test', () => {
    let comment1;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const userModel = "5f9f5b3b1c1d4cafa959dcf2";
        // const userModel = PostModel.findById(postId).populate('user');
        console.log("------USER------");
        console.log(userModel);
        comment1 = {
            user: userModel,
            post: `${postId}`,
            body: 'test comment',
        };
    }));
    test('Create Comment : /posts/comments/:id/createComment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/comments/${postId}/createComment`)
            .send(comment1);
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body).toMatchObject(comment1);
    }));
});
//# sourceMappingURL=comment.test.js.map