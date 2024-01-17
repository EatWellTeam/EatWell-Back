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
const post_model_1 = __importDefault(require("../models/post_model"));
const comments_model_1 = __importDefault(require("../models/comments_model"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("------CREATE COMMENT------");
    const { user, post, body } = req.body;
    try {
        const newComment = yield comments_model_1.default.create({
            user,
            post,
            body,
        });
        yield post_model_1.default.findByIdAndUpdate(post, {
            $push: { comments: newComment._id },
        });
        res.status(200).json(newComment);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("------GET COMMENT BY ID------");
    const postId = req.params.id;
    const commentId = req.params.commentId;
    try {
        // Fetch the post and populate the comments
        const post = yield post_model_1.default.findById(postId).populate('comments');
        // Find the specific comment
        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (comment) {
            res.status(200).json(comment);
        }
        else {
            res.status(404).json("Comment not found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = { createComment, getCommentById };
//# sourceMappingURL=comment_controller.js.map