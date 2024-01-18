"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, },
    title: { type: String, required: true, min: 4, },
    body: { type: String, required: true, },
    comments: { type: [String], required: false, },
    likes: { type: [String], required: false, },
    createdAt: { type: Date, default: Date.now, },
});
const postModel = (0, mongoose_1.model)("Post", postSchema);
exports.default = postModel;
//# sourceMappingURL=post_model.js.map