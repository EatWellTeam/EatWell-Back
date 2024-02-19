"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userActivity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "UserActivity",
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const CommentModel = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = CommentModel;
//# sourceMappingURL=comments_model.js.map