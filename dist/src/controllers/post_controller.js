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
// import Comment from "../models/comments_model";
// import Like from "../models/likes_model";
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    {
        console.log(req.body);
        try {
            const post = yield post_model_1.default.create({
                user: req.body.user,
                title: req.body.title,
                body: req.body.body,
                comments: req.body.comments,
                likes: req.body.likes,
            });
            if (post) {
                res.status(200).json({ post });
            }
        }
        catch (error) {
            console.log(error);
            res.status(404).json({ message: "Post not created" });
        }
    }
});
exports.default = { createPost };
//# sourceMappingURL=post_controller.js.map