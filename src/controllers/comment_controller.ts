
import CommentModel, { IComment } from "../models/comments_model";
import  { BaseController } from "./base_controller";
 import { Request, Response } from "express";
 import Post from "../models/post_model";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

    async post(req: Request, res: Response): Promise<void>  {
      console.log("Post method in base controller ===> " + req.body);
      console.log("Post method in base controller ===> " + req.params.id);
      try {
        
          if (!req.params.id) {
      res.status(400).send("Post id is required to add comment");
      return;
          }
          const post = await Post.findById(req.params.id);
          console.log(post);
          if (!post) {
          res.status(401).send("Post not found to add comment");
          return;
          }
          else{
            console.log("Post found");
            const comment = new CommentModel({
              user: req.body.user,
              post: req.params.id,
              body: req.body.body,
            });
            console.log(comment);
            const result = await comment.save();
            post.comments.push(result._id);
            await post.save();
            res.status(201).send(result);
          }
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
        return;
      }
    }
    

    async deleteById(req: Request, res: Response): Promise<void> {
      try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
          res.status(404).send("Post not found to delete comment");
          return;
        }
        const comment = await CommentModel.findByIdAndDelete(req.params.id);
        if (!comment) {
          res.status(404).send("Comment not found");
          return;
        }
        post.comments = post.comments.filter((id) => id.toString() !== req.params.id);
        await post.save();
        res.status(200).send("Deleted successfully");
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      }
  }
}
export default new CommentsController();