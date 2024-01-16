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
export default { createComment };