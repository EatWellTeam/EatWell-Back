import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserActivityModel from "../models/userActivity_model";
import { OAuth2Client } from "google-auth-library";
import { Document } from "mongoose";
import path from "path";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignin = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
      let user = await User.findOne({ email: email });
      if (user == null) {
        user = await User.create({
          email: email,
          password: "",
          imgUrl: payload?.picture,
        });
      }
      const tokens = await generateTokens(user);
      res.status(200).send({
        email: user.email,
        _id: user._id,
        imageUrl: user.profileImage,
        ...tokens,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const register = async (req: Request, res: Response): Promise<Response> => {
  // console.log("register");
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
    const fileName = path.basename(
      path.join(__dirname, "default_picture.jpeg")
    );
    const newUser = await User.create({
      email: email,
      password: encryptedPassword,
      profileImage: fileName,
    });

    await UserActivityModel.create({
      user: newUser._id,
      email: newUser.email,
      post: [],
      comments: [],
      createdAt: new Date(),
    });
    const token = await generateTokens(newUser);
    return res.status(201).json({
      email: newUser.email,
      _id: newUser._id,
      profileImage: newUser.profileImage,
      ...token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Error - " + error);
  }
};

const generateTokens = async (user: Document & IUser) => {
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
  await user.save();
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  // console.log("login");
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

    const tokens = await generateTokens(user);

    return res.status(200).json({
      email: user.email,
      _id: user._id,
      profileImage: user.profileImage,
      ...tokens,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Error - " + error);
  }
};

const logout = async (req: Request, res: Response) => {
  // console.log("logout");

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

// const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
//   console.log("getUserInfo");

//   const authHeader = req.headers["authorization"];
//   const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!accessToken) {
//     return res.status(401).send("Unauthorized: Access token is missing");
//   }

//   try {
//     const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {
//       _id: string;
//     };
//     const user = await User.findOne({ _id: decodedToken._id });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // Customize the user information you want to return
//     const userInfo = {
//       _id: user._id,
//       email: user.email,
//       // Add more user properties as needed
//     };

//     return res.status(200).send(userInfo);
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send("Unauthorized: Invalid access token");
//   }
// };

export default {
  register,
  login,
  logout,
  refresh,
  // getUserInfo, // Add the new method to export
  googleSignin,
};
