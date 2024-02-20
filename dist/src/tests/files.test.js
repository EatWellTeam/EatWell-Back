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
const path_1 = __importDefault(require("path"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("------File Tests Start------");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("------File Tests End------");
}));
describe("File Tests", () => {
    test("upload files", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, "batman.png");
        console.log("filepath:" + filePath);
        try {
            const response = yield (0, supertest_1.default)(app)
                .post("/file")
                .attach("file", filePath);
            expect(response.status).toBe(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, "");
            console.log(url);
            const res = yield (0, supertest_1.default)(app).get(url);
            expect(res.status).toBe(200);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
});
//# sourceMappingURL=files.test.js.map