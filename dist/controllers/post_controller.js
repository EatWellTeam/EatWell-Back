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
// const getOnePost = async (req: Request, res: Response) => {
//   // try {
//   //   const post = await Post.findById(req.params.postId);
//   //   res.json(post);
//   // } catch (err) {
//   //   res.json({message: err});
//   // }
//   res.status(404).send("Not implemented");
// }
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    {
        console.log(req.body);
        const post = new post_model_1.default(Object.assign({}, req.body));
        try {
            const savedPost = yield post.save();
            res.status(200).json(savedPost);
        }
        catch (err) {
            res.json({ message: err });
        }
    }
});
exports.default = { createPost };
//# sourceMappingURL=post_controller.js.map