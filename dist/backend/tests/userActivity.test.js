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
// import request from "supertest";
const mongoose_1 = __importDefault(require("mongoose"));
// import appPromise from "../app";
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
// import { Express } from "express";
const auth_test_1 = require("./auth.test");
const user_model_1 = __importDefault(require("../models/user_model"));
// let app: Express;
const user = {
    email: "kuku@gmail.com",
    fullName: "kuku",
    dateOfBirth: "1990-01-01",
    password: "123",
};
// let ObjectId: mongoose.Types.ObjectId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // app = await appPromise();
    console.log("------User Activity Test Start------");
    yield userActivity_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield (0, auth_test_1.createUser)(user);
    // ObjectId = new mongoose.Types.ObjectId();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("------User Activity Test End------");
}));
describe("User Activity Test", () => {
    // test("should get all user activity", async () => {
    //   const response = await request(app).get("/userActivity/find/all");
    //   console.log("all users : ", response.body);
    //   expect(response.status).toBe(200);
    // });
    // test("should get user activity by id", async () => {
    //   const userActivity = await UserActivity.findOne({ email: user.email });
    //   const response = await request(app).get(
    //     `/userActivity/${userActivity?._id}`
    //   );
    //   console.log("User Activity Response : ", response.body);
    //   expect(response.status).toBe(200);
    // });
    // test("should not get user activity by id", async () => {
    //   const response = await request(app).get(`/userActivity/${ObjectId}`);
    //   expect(response.status).toBe(404);
    //   expect(response.body.message).toBe("Not Found");
    // });
});
//# sourceMappingURL=userActivity.test.js.map