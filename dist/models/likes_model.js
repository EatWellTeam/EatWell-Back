"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const LikeModel = (0, mongoose_1.model)("Like", likeSchema);
exports.default = LikeModel;
//# sourceMappingURL=likes_model.js.map