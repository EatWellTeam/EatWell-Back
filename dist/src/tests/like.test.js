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
exports.likePost = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let app;
function likePost(user, user2, accessToken2, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            app = yield (0, app_1.default)();
        }));
        describe("Like tests", () => {
            test("TEST 4: POST post not found for add likes", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
                    .set('Authorization', `JWT ${accessToken2}`);
                expect(response.statusCode).toEqual(404);
                expect(response.body.message).toEqual("Post not found");
            }));
            test('TEST 5: DELETE like post not found', () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .delete(`/posts/65a3f0c6c1d4cafa959dcf32/like`).send(user2)
                    .set('Authorization', `JWT ${accessToken2}`);
                expect(response.statusCode).toEqual(404);
                expect(response.body.message).toEqual("Post not found");
            }));
            test("TEST 7: Post Like", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post(`/posts/${postId}/like`).send(user2)
                    .set('Authorization', `JWT ${accessToken2}`);
                expect(response.statusCode).toEqual(200);
                expect(response.body.message).toEqual("Post liked");
            }));
            test("TEST 8: DELETE Post Like - Like not found", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .delete(`/posts/${postId}/like`).send(user)
                    .set('Authorization', `JWT ${accessToken2}`);
                expect(response.statusCode).toEqual(402);
                expect(response.body.message).toEqual("Like not found");
            }));
            test("TEST 8: DELETE Post Like", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .delete(`/posts/${postId}/like`).send(user2)
                    .set('Authorization', `JWT ${accessToken2}`);
                expect(response.statusCode).toEqual(200);
                expect(response.body.message).toEqual("Post unliked");
            }));
        });
    });
}
exports.likePost = likePost;
//# sourceMappingURL=like.test.js.map