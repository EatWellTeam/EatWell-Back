import { Request, Response } from "express";
import User from "../models/user_model";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user_model";

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send("Email Already Used");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email: email,
      password: encryptedPassword,
    });
    newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Error - " + error);
  }
};
