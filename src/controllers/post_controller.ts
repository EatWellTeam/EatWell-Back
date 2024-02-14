
import Post,{IPost} from "../models/post_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import UserActivity from "../models/userActivity_model";
import mongoose from "mongoose";
class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }
  async deleteLike(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        const length = post.likes.length;
         post.likes = post.likes.filter((like) => like !== req.body.email);
        if (length === post.likes.length) {
          res.status(402).json({ message: "Like not found" });
          return;
        }
        await post.save();
        res.status(200).json({ message: "Post unliked" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addLike(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        post.likes.push(req.body.email);
        await post.save();
        res.status(200).json({ message: "Post liked" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async post(req: Request, res: Response) {
    try{
      const post = await Post.create(req.body);
        if(post){
          
        }
         

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}
}
export default new PostController();

