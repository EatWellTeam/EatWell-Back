import {Request, Response} from "express";
import Post from "../models/post_model";
// import Comment from "../models/comments_model";
// import Like from "../models/likes_model";

const createPost = async (req: Request, res: Response) => {{
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
}
export default {createPost};