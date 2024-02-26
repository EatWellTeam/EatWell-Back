"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const comments_route_1 = __importDefault(require("./routes/comments_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const userActivity_route_1 = __importDefault(require("./routes/userActivity_route"));
const files_route_1 = __importDefault(require("./routes/files_route"));
// import userRoute from "./routes/user_route";
const path_1 = __importDefault(require("path"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/auth", auth_route_1.default);
            app.use("/posts", post_route_1.default);
            app.use("/posts/comments", comments_route_1.default);
            app.use("/userActivity", userActivity_route_1.default);
            // app.use("/user", userRoute);
            app.use("/public", express_1.default.static(path_1.default.join(__dirname, "/public")));
            app.use("/file", files_route_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map