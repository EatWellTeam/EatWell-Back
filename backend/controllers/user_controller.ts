import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import UserActivity from "../models/userActivity_model";
import jwt from "jsonwebtoken";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }
  async updatePassword(req: Request, res: Response) {
    console.log("req.body", req.body);
    console.log("current password", req.body.password);
    console.log("new password", req.body.newPassword);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("user password", user.password);
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

    res.json({ message: "Password updated", password: user.password });
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    await UserActivity.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
  }

  // async updateProfilePicture(req: Request, res: Response) {
  //   if (!req.file) {
  //     return res.status(400).send("No picture uploaded");
  //   } else {
  //     const user = await User.findById(req.params.id);
  //     if (!user) {
  //       return res.status(404).send("User not found");
  //     }
  //     console.log("req.file", req.file);
  //     console.log("req.file.filename", req.file.filename);

  //     user.profileImage = req.file.filename;
  //     await user.save();
  //     res.json({
  //       message: "Profile picture updated",
  //       profileImage: user.profileImage,
  //     });
  //   }
  // }
  async getById(req: Request, res: Response): Promise<void> {
    const accessToken = req.headers.authorization?.split(" ")[1];

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {
      _id: string;
    };
    const user =
      (await User.findOne({ _id: decodedToken._id })) &&
      (await User.findById(req.params.id));

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Customize the user information you want to return
    const userInfo = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      // profileImage: user.profileImage,
      // Add more user properties as needed
    };

    res.status(200).send(userInfo);
    return;
  }
}
export default new UserController();
