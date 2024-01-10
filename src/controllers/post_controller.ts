import {Request, Response} from "express";
import Post from "../models/post_model";
// import Comment from "../models/comments_model";
// import Like from "../models/likes_model";

const createPost = async (req: Request, res: Response) => {
  console.log(req.body);
  try{
    const post = await Post.create({
      user: req.body.user,
      title: req.body.title,
      body: req.body.body,
      comments: req.body.comments,
      likes: req.body.likes,
    });
    if(post){
      res.status(200).json({post});
    }
  }catch(error){
    console.log(error);
    res.status(404).json({message: "Post not created"});
  }
 
}
const getOnePost = async (req:Request, res:Response) => {
  try {

      const post = await Post.findOne({user: req.params.postId});
      if (!post) {
          return res.status(500).json({ msg: "No such post with this id!" })
      } else {
          return res.status(200).json(post)
      }
  } catch (error) {
      return res.status(500).json(error.message)
  }
}

export default {createPost, getOnePost};