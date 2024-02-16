import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import UserActivity, { IUserActivity } from "../models/userActivity_model";

class UserActivityController extends BaseController<IUserActivity> {
  constructor() {
    super(UserActivity);
  }
  async getUserPosts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userPosts = await UserActivity.find({ user: id }).populate("post");
      res.status(200).json(userPosts.map((post) => post.post));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getUserComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userComments = await UserActivity.find({ user: id }).populate(
        "comment"
      );
      res.status(200).json(userComments.map((comment) => comment.comment));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new UserActivityController();
