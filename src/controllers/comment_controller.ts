
import CommentModel, { IComment } from "../models/comments_model";
import  { BaseController } from "./base_controller";
 import { Request, Response } from "express";
 import Post from "../models/post_model";
import UserActivity from "../models/userActivity_model";

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

    async post(req: Request, res: Response): Promise<void>  {
      // console.log("Post method in base controller ===> " + req.body);
      // console.log("Post method in base controller ===> " + req.params.id);
      try {
          const user = await UserActivity.findOne({user: req.body.user})
          if(!user){
            res.status(403).send("User not found");
            return;
          }
          const post = await Post.findById(req.params.id);
          console.log(post);
          if (!post) {
          res.status(402).send("Post not found to add comment");
          return;
          }
          else{
            console.log("Post found");
            const comment = await CommentModel.create(req.body);
            if(comment){
              post.comments.push(comment._id);
              await post.save();
              await UserActivity.findOneAndUpdate({user: comment.user},{comment: comment._id},{upsert: true});
              res.status(201).send(comment);
            }
            else{
              res.status(402).send("Error in creating object");
            }
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
        await UserActivity.findOneAndDelete({comment: req.params.id});
        res.status(200).send("Deleted successfully");
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      }
  }
}
export default new CommentsController();