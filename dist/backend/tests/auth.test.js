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
exports.createUser = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
// import UserActivity from "../models/userActivity_model";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    // await User.deleteMany();
    // await UserActivity.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const user = {
    email: "testAuth@test.com",
    fullName: "testAuth",
    dateOfBirth: "1990-01-01",
    password: "1234567890",
};
const user2 = {
    email: "testUser@test.com",
};
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/auth/register").send(user); //register user
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        return response.body.accessToken;
    });
}
exports.createUser = createUser;
let refreshToken;
let newRefreshToken;
describe("Auth tests", () => {
    console.log("authUser");
    // test("test register for internal server error", async () => {
    //   // Simulate a database connection error
    //   jest.spyOn(User, "findOne").mockImplementationOnce(() => {
    //     throw new Error("Database connection error");
    //   });
    //   const response = await request(app).post("/auth/register").send(user);
    //   // Expect the server to return a 500 status code (Internal Server Error)
    //   expect(response.statusCode).toEqual(500);
    // });
    // test(" test login for internal server error", async () => {
    //   // Simulate a database connection error
    //   jest.spyOn(User, "findOne").mockImplementationOnce(() => {
    //     throw new Error("Database connection error");
    //   });
    //   const response = await request(app).post("/auth/login").send(user);
    //   // Expect the server to return a 500 status code (Internal Server Error)
    //   expect(response.statusCode).toEqual(500);
    // });
    test("TEST 1 test register", () => __awaiter(void 0, void 0, void 0, function* () {
        const existedUser = yield user_model_1.default.findOne({ email: user.email });
        if (!existedUser) {
            const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user); //register user
            expect(response.statusCode).toEqual(201);
        }
    }));
    test("TEST 2 test register for missing email / password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Missing email or password");
    }));
    test("TEST 3: test register for existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        expect(response.statusCode).toEqual(409);
        expect(response.text).toEqual("Email Already Used");
    }));
    test("TEST 5: test login for missing email / password", () => __awaiter(void 0, void 0, void 0, function* () {
        user.email = undefined;
        const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user); //user didn't login
        expect(response2.statusCode).toEqual(400);
        expect(response2.text).toEqual("missing email or password");
        user.email = "testAuth@test.com";
    }));
    test("TEST 6: test login for incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        user.password = "123456789";
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(response.statusCode).toEqual(401);
        expect(response.text).toEqual("email or password incorrect");
        user.password = "1234567890";
    }));
    test("TEST 7: test login for incorrect email", () => __awaiter(void 0, void 0, void 0, function* () {
        user.email = "kuku123@gmail.com";
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(response.statusCode).toEqual(401);
        expect(response.text).toEqual("email or password incorrect");
        user.email = "testAuth@test.com";
    }));
    test("TEST 8: test for logout with no token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/auth/logout");
        expect(response.statusCode).toEqual(401);
    }));
    test("TEST 9: test login for correct email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user); //user logged in
        expect(response.statusCode).toEqual(200);
        refreshToken = response.body.refreshToken;
        console.log("refreshToken: " + refreshToken);
    }));
    test("TEST 10: Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken);
        expect(response2.statusCode).toBe(200);
    }));
    test("TEST 11: test logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", `JWT ${newRefreshToken}`);
        console.log("logout response:");
        console.log(response.text);
        expect(response.statusCode).toEqual(200);
    }));
    test("TEST 12: Test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
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
    test("TEST 13: no refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/auth/refresh").send();
        expect(response.statusCode).not.toBe(200);
    }));
    test("TEST 14: test logout for error verifying token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Try to logout with an invalid token
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "Bearer invalid_token");
        expect(response.statusCode).toEqual(402);
    }));
});
//# sourceMappingURL=auth.test.js.map