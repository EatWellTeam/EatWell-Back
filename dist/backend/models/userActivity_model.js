"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userActivitySchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    post: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    comment: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    createdAt: { type: Date, default: Date.now },
});
const UserActivityModel = mongoose_1.default.model("UserActivity", userActivitySchema);
exports.default = UserActivityModel;
//# sourceMappingURL=userActivity_model.js.map