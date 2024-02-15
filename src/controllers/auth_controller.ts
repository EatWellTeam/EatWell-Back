import { Request, Response } from "express";
import User from "../models/user_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserActivityModel from "../models/userActivity_model";

const register = async (req: Request, res: Response):Promise<Response> => {
  console.log("register");
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

    const userActivity = await (await UserActivityModel.create({user: newUser._id, email: newUser.email, createdAt: new Date()})).populate("user");
    userActivity.save();
    return res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Error - " + error);
  }
};

const login = async (req: Request, res: Response) => {
  console.log("login");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("email or password incorrect");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("email or password incorrect");
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    if (user.refreshTokens == null) {
      user.refreshTokens = [refreshToken];
    } else {
      user.refreshTokens.push(refreshToken);
    }
    await UserActivityModel.findOne({user: user._id}).populate("user").exec();

    await user.save();
    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Error - " + error);
  }
};

const logout = async (req: Request, res: Response) => {
  console.log("logout");

  const authHeader = req.headers["authorization"];
 
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      console.log(err);
      if (err) {
        console.log(err);
        return res.status(402).send(err);
      }
      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(200);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(403).send(err.message);
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (t) => t !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  logout,
  refresh,
};
