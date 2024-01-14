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
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("create post");
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
});
const getOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get one post");
    try {
        const existedPost = yield post_model_1.default.find();
        if (existedPost.length === 0) {
            return res.status(500).send("No posts found!");
        }
        const postId = req.params.id;
        const post = yield post_model_1.default.findById(postId);
        console.log(post);
        if (!post) {
            return res.status(500).json({ msg: "No such post with this id!" });
        }
        else {
            return res.status(200).json({ post });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get all posts");
    try {
        const posts = yield post_model_1.default.find();
        if (!posts) {
            return res.status(500).json({ msg: "No posts found!" });
        }
        else {
            return res.status(200).json({ posts });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("update post");
    try {
        const postId = req.params.id;
        const post = yield post_model_1.default.findById(postId);
        if (!post) {
            return res.status(500).send("No such post with this id!");
        }
        else {
            const updatedPost = yield post_model_1.default.findByIdAndUpdate(postId, req.body, { new: true });
            return res.status(200).json({ updatedPost });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = { createPost, getOnePost, getAllPosts, updatePost };
//# sourceMappingURL=post_controller.js.map