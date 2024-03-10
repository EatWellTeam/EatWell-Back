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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
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
                        res.status(404).json({ message: "Like not found" });
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
                const user = yield user_model_1.default.findOne({ email: req.body.email });
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const post = yield post_model_1.default.findById(req.params.id);
                if (post) {
                    if (post.likes.includes(req.body.email)) {
                        res.status(409).json({ message: "Post already liked" });
                        return;
                    }
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
            const user = yield user_model_1.default.findById(req.body.user);
            if (!user) {
                res.status(404).send("User not found");
                return;
            }
            try {
                if (req.file) {
                    // const fileName = path.basename(
                    //   path.join(__dirname, "default_picture.jpeg")
                    // );
                    req.body.picture = req.file.path;
                    console.log("req.body.picture: " + req.body.picture);
                }
                const post = yield post_model_1.default.create(req.body);
                if (post) {
                    const userActivity = yield userActivity_model_1.default.findOneAndUpdate({ user: post.user }, { $push: { post: post._id } }, { upsert: true });
                    if (userActivity) {
                        res.status(201).send(post);
                    }
                }
            }
            catch (err) {
                console.error(err.message);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_model_1.default.findById(req.params.id);
                if (!post) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                const userActivity = yield userActivity_model_1.default.findOne({ post: post._id });
                if (userActivity) {
                    const comments = yield comments_model_1.default.find({ post: post._id });
                    const commentIds = comments.map((comment) => comment._id);
                    const userIds = comments.map((comment) => comment.user);
                    yield userActivity_model_1.default.updateMany({ user: { $in: userIds } }, { $pull: { comment: { $in: commentIds } } });
                    yield userActivity_model_1.default.findOneAndUpdate({ user: post.user }, { $pull: { post: post._id } });
                    yield comments_model_1.default.deleteMany({ post: post._id });
                    yield post_model_1.default.findByIdAndDelete(req.params.id);
                    res.status(200).json({ message: "Deleted successfully" });
                    return;
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map