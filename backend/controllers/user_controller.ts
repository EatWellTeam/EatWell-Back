// //TODO:
// //1.delete user
// //2.update user
// import { BaseController } from "./base_controller";
// import { Request, Response } from "express";
// import User, { IUser } from "../models/user_model";
// import bcrypt from "bcrypt";

// import UserActivity from "../models/userActivity_model";

// class UserController extends BaseController<IUser> {
//   constructor() {
//     super(User);
//   }
//   async updatePassword(req: Request, res: Response) {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!validPassword) {
//       return res.status(400).send("Invalid password");
//     }
//     user.password = await bcrypt.hash(req.body.newPassword, 10);
//     await user.save();

//     res.send("Password changed");
//   }
// }
// export default new UserController();
