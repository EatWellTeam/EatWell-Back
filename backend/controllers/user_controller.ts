//TODO:
//1.delete user
//2.update user
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import UserActivity from "../models/userActivity_model";
import Post from "../models/post_model";
import Comment from "../models/comments_model";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }
  async updatePassword(req: Request, res: Response) {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }
    console.log("user old password - controller", user.password);
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    console.log("user new password - coontroller", user.password);

    res.send("Password changed");
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    await UserActivity.deleteMany({ user: user._id });
    await Post.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
  }
}
export default new UserController();
