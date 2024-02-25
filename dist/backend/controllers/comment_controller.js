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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const base_controller_1 = require("./base_controller");
const post_model_1 = __importDefault(require("../models/post_model"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const mongoose_1 = __importDefault(require("mongoose"));
class CommentsController extends base_controller_1.BaseController {
    constructor() {
        super(comments_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Post method in base controller ===> " + req.body);
            // console.log("Post method in base controller ===> " + req.params.id);
            try {
                const user = yield userActivity_model_1.default.findOne({ user: req.body.user });
                if (!user) {
                    res.status(401).send("User not found");
                    return;
                }
                const post = yield post_model_1.default.findById(req.params.id);
                console.log(post);
                if (!post) {
                    res.status(404).send("Post not found to add comment");
                    return;
                }
                else {
                    console.log("Post found");
                    const comment = yield comments_model_1.default.create(req.body);
                    if (comment) {
                        post.comments.push(comment._id);
                        yield post.save();
                        yield userActivity_model_1.default.findOneAndUpdate({ user: comment.user }, { $push: { comment: comment._id } }, { upsert: true });
                        res.status(201).send(comment);
                    }
                }
            }
            catch (err) {
                console.error(err.message);
                res.status(500).send("Internal Server Error");
                return;
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_model_1.default.findById(req.params.postId);
                if (!post) {
                    res.status(404).send("Post not found to delete comment");
                    return;
                }
                const comment = yield comments_model_1.default.findByIdAndDelete(req.params.id);
                if (!comment) {
                    res.status(404).send("Comment not found");
                    return;
                }
                post.comments = post.comments.filter((id) => id.toString() !== req.params.id);
                yield post.save();
                const ObjectId = mongoose_1.default.Types.ObjectId;
                yield userActivity_model_1.default.findOneAndUpdate({ comment: new ObjectId(req.params.id) }, { $set: { comment: [] } });
                res.status(200).send("Deleted successfully");
            }
            catch (err) {
                console.error(err.message);
                res.status(500).send("Internal Server Error");
            }
        });
    }
}
exports.default = new CommentsController();
//# sourceMappingURL=comment_controller.js.map