import {Request, Response} from "express";
import Post from "../models/post_model";
import Comment from "../models/comments_model";


const createComment = async (req: Request, res: Response) => {
  console.log("------CREATE COMMENT------");
  const { user, post, body } = req.body;
  try {
    const newComment = await Comment.create({
      user,
      post,
      body,
    });
    await Post.findByIdAndUpdate(post, {
      $push: { comments: newComment._id },
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
}
const getCommentById = async (req: Request, res: Response) => {
  console.log("------GET COMMENT BY ID------");
  const  postId  = req.params.id;
  const commentId = req.params.commentId;
  try {
   // Fetch the post and populate the comments
   const post = await Post.findById(postId).populate('comments');

   // Find the specific comment
   const comment = post.comments.find(comment => comment._id.toString() === commentId);
   if(comment){
      res.status(200).json(comment);
   }
    else{
        res.status(404).json("Comment not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
export default { createComment, getCommentById };