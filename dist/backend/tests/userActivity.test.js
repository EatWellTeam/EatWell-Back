"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
let app;
const User = {
    email: "kuku@gmail.com",
    fullName: "kuku",
    dateOfBirth: "1990-01-01",
    password: "123",
    gender: "male",
    age: 30,
    weight: 80,
    height: 180,
    activityLevel: "sedentary",
    goal: "lose",
};
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("User Activity", () => {
    test("should return all useres activity", async () => {
        const res = await (0, supertest_1.default)(app).get("/userActivity");
        expect(res.status).toBe(200);
    });
    test("update user weight", async () => {
        await (0, supertest_1.default)(app).post("/auth/register").send(User);
        const response = await (0, supertest_1.default)(app).post("/auth/login").send(User);
        const user_id = response.body._id;
        const res = await (0, supertest_1.default)(app).put("/userActivity/updateWeight").send({ userId: user_id, weight: 90 });
        expect(res.status).toBe(200);
    });
});
//# sourceMappingURL=userActivity.test.js.map