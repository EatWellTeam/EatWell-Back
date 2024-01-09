import {Request, Response} from "express";
import Post from "../models/post_model";
// import Comment from "../models/comments_model";
// import Like from "../models/likes_model";

const createPost = async (req: Request, res: Response) => {{
  console.log(req.body);
  const post = new Post(req.body );
  try {
    const savedPost = await post.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.json({message: err});
  }

}
}
export default {createPost};