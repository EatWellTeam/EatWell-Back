
import CommentModel, { IComment } from "../models/comments_model";
import  { BaseController } from "./base_controller";
import { Request, Response } from "express";
class CommentsController extends BaseController<IComment> {
  constructor() {
    super(CommentModel);
  }

     getById = async (req: Request, res: Response) => {
    try {
      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).send(comment);
    }catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default new CommentsController();