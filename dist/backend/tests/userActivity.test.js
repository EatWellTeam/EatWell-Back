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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const auth_test_1 = require("./auth.test");
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const post_test_1 = __importDefault(require("./post.test"));
let app;
let userId;
let user;
let ObjectId;
let accessToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("------User Activity Test Start------");
    yield userActivity_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield post_model_1.default.deleteMany();
    user = {
        email: "kuku@gmail.com",
        password: "123",
    };
    accessToken = yield (0, auth_test_1.createUser)(user);
    userId = yield user_model_1.default.findOne({ email: user.email }).then((user) => {
        return user === null || user === void 0 ? void 0 : user._id.toHexString();
    });
    post_test_1.default.user = userId;
    yield (0, supertest_1.default)(app)
        .post("/posts/addPost")
        .send(post_test_1.default)
        .set("Authorization", `JWT ${accessToken}`);
    ObjectId = new mongoose_1.default.Types.ObjectId();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("------User Activity Test End------");
}));
describe("User Activity Test", () => {
    test("should get all user activity", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userActivity/find/all");
        console.log("all users : ", response.body);
        expect(response.status).toBe(200);
    }));
    test("should get user activity by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const userActivity = yield userActivity_model_1.default.findOne({ email: user.email });
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${userActivity === null || userActivity === void 0 ? void 0 : userActivity._id}`);
        console.log("User Activity Response : ", response.body);
        expect(response.status).toBe(200);
    }));
    test("get posts of user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${userId}/posts`);
        console.log("User Posts : ", response.body);
        expect(response.status).toBe(200);
    }));
    test("get comments of user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${userId}/comments`);
        console.log("User Comments : ", response.body);
        expect(response.status).toBe(200);
    }));
    test("user not found for getting posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${ObjectId}/posts`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found");
    }));
    test("user not found for getting comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${ObjectId}/comments`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found");
    }));
    test("should not get user activity by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/userActivity/${ObjectId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Not Found");
    }));
});
//# sourceMappingURL=userActivity.test.js.map