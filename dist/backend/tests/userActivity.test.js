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
};
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await (0, supertest_1.default)(app).post("/auth/register").send(User);
    const response = await (0, supertest_1.default)(app).post("/auth/login").send(User);
    const user_id = response.body.user_id;
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
        const res = await (0, supertest_1.default)(app).put("/userActivity/updateWeight").send({ userId: '669cd2e7a2f16c9f3fc83d17', weight: 70 });
        expect(res.status).toBe(200);
    });
});
//# sourceMappingURL=userActivity.test.js.map