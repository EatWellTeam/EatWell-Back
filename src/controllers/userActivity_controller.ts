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
      const userPosts = await UserActivity.findOne({ user: id }).populate(
        "post"
      );
      if (!userPosts) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(userPosts.post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getUserComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userComments = await UserActivity.findOne({ user: id }).populate(
        "comment"
      );
      if (!userComments) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(userComments.comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new UserActivityController();
