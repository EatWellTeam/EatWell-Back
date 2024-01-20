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
exports.authUser = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
authUser();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
function authUser() {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken;
        const user = {
            email: "testUser@test.com",
            password: "1234567890",
        };
        const user2 = {
            email: "testUser@test.com"
        };
        const user3 = {
            email: "test@test.com",
            password: "1234567890"
        };
        let refreshToken;
        let newRefreshToken;
        describe("Auth tests", () => {
            test("test register", () => __awaiter(this, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).post("/auth/register").send(user); //register user
                const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user); //user logged in
                expect(response.statusCode).toEqual(200);
                accessToken = response.body.accessToken;
            }));
            test("test register for missing email / password", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
                expect(response.statusCode).toEqual(400);
                expect(response.text).toEqual("Missing email or password");
            }));
            test("test register for existing email", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
                expect(response.statusCode).toEqual(409);
                expect(response.text).toEqual("Email Already Used");
            }));
            test("test register user", () => __awaiter(this, void 0, void 0, function* () {
                yield user_model_1.default.deleteMany({ 'email': user3.email });
                const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user3); //user 3 register
                expect(response.statusCode).toEqual(201);
            }));
            test("test login for missing email / password", () => __awaiter(this, void 0, void 0, function* () {
                user3.email = undefined;
                const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user3); //user3 didn't login
                expect(response2.statusCode).toEqual(400);
                expect(response2.text).toEqual("missing email or password");
                user3.email = "test@test.com";
            }));
            test("test login for incorrect password", () => __awaiter(this, void 0, void 0, function* () {
                user3.password = "123456789";
                const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user3);
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("email or password incorrect");
                user3.password = "1234567890";
            }));
            test("test login for incorrect email", () => __awaiter(this, void 0, void 0, function* () {
                user3.email = "kuku123@gmail.com";
                const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user3);
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("email or password incorrect");
                user3.email = "test@test.com";
            }));
            test("test for logout with no token", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app).get("/auth/logout");
                expect(response.statusCode).toEqual(401);
            }));
            test("test login for correct email and password", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user); //user logged in
                expect(response.statusCode).toEqual(200);
                accessToken = response.body.accessToken;
            }));
            test("test logout", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app).get("/auth/logout").set('Authorization', `JWT ${accessToken}`);
                console.log("logout response:");
                console.log(response.text);
                expect(response.statusCode).toEqual(200);
            }));
            test("Test refresh token", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get("/auth/refresh")
                    .set("Authorization", "JWT " + refreshToken)
                    .send();
                expect(response.statusCode).toBe(200);
                expect(response.body.accessToken).toBeDefined();
                expect(response.body.refreshToken).toBeDefined();
                const newAccessToken = response.body.accessToken;
                newRefreshToken = response.body.refreshToken;
                const response2 = yield (0, supertest_1.default)(app)
                    .get("/student")
                    .set("Authorization", "JWT " + newAccessToken);
                expect(response2.statusCode).toBe(200);
            }));
            test("Test double use of refresh token", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get("/auth/refresh")
                    .set("Authorization", "JWT " + refreshToken)
                    .send();
                expect(response.statusCode).not.toBe(200);
                //verify that the new token is not valid as well
                const response1 = yield (0, supertest_1.default)(app)
                    .get("/auth/refresh")
                    .set("Authorization", "JWT " + newRefreshToken)
                    .send();
                expect(response1.statusCode).not.toBe(200);
            }));
        });
    });
}
exports.authUser = authUser;
//# sourceMappingURL=auth.test.js.map