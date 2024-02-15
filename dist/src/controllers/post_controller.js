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
const base_controller_1 = require("./base_controller");
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    deleteLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_model_1.default.findById(req.params.id);
                if (post) {
                    const length = post.likes.length;
                    post.likes = post.likes.filter((like) => like !== req.body.email);
                    if (length === post.likes.length) {
                        res.status(402).json({ message: "Like not found" });
                        return;
                    }
                    yield post.save();
                    res.status(200).json({ message: "Post unliked" });
                }
                else {
                    res.status(404).json({ message: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    addLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userActivity = yield userActivity_model_1.default.findOne({ email: req.body.email });
                if (!userActivity) {
                    res.status(402).json({ message: "User not found" });
                    return;
                }
                const post = yield post_model_1.default.findById(req.params.id);
                if (post) {
                    post.likes.push(req.body.email);
                    yield post.save();
                    res.status(200).json({ message: "Post liked" });
                }
                else {
                    res.status(404).json({ message: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_model_1.default.create(req.body);
                if (post) {
                    const userActivity = yield userActivity_model_1.default.findOneAndUpdate({ user: post.user }, { post: post._id }, { upsert: true });
                    if (userActivity) {
                        res.status(201).send(post);
                    }
                }
                else {
                    res.status(402).send("Error in creating object");
                }
            }
            catch (err) {
                console.error(err.message);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map