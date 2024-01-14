import {Request, Response} from "express";
import Post from "../models/post_model";


const createPost = async (req: Request, res: Response) => {
  console.log("create post")
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
  console.log("get one post")
  try {
    const existedPost = await Post.find();
    if(existedPost.length === 0){
      return res.status(500).send("No posts found!");
    }
    const postId = req.params.id;
      const post = await Post.findById(postId);
      console.log(post);
      if (!post) {
          return res.status(500).json({ msg: "No such post with this id!" })
      } else {
          return res.status(200).json({post});
      }
  } catch (error) {
      return res.status(500).json({message:error.message});
  }

}
const getAllPosts = async (req:Request, res:Response) => {
  console.log("get all posts")
  try {
      const posts = await Post.find();
      if (!posts) {
          return res.status(500).json({ msg: "No posts found!" })
      } else {
          return res.status(200).json({posts});
      }
  } catch (error) {
      return res.status(500).json({message:error.message});
  }

}
const updatePost = async (req:Request, res:Response) => {
  console.log("update post")
  try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(500).json({ msg: "No such post with this id!" })
      } else {
          const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
          return res.status(200).json({ updatedPost });
      }
  } catch (error) {
      return res.status(500).json({message:error.message});
  }

}

  

export default {createPost, getOnePost, getAllPosts, updatePost};