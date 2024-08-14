import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserActivityModel from "../models/userActivity_model";
import userActivityController from '../controllers/userActivity_controller';
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
    console.log("payload", payload);

    const email = payload?.email;
    console.log("email", email);
    if (email != null) {
      let user = await User.findOne({ email: email });
      console.log("find user", user);
      console.log("user picture", payload?.picture);

      if (user == null) {
        user = await User.create({
          email: email,
          fullName: payload?.name,
          dateOfBirth: new Date(),
          password: "1010",
          profileImage: payload?.picture,
        });
        console.log("create user", user);
        await UserActivityModel.create({
          user: user._id,
          gender: "",
          age: 0,
          currentWeight: 0,
          weightHistory: [],
          height: 0,
          activityLevel: "",
          goal: "",
          recommendedCalories: 0,
          nutritionValues: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          createdAt: new Date(),
        });
      }

      const tokens = await generateTokens(user);
      console.log("tokens", tokens);

      res.status(200).send({
        email: user.email,
        _id: user._id,
        // profileImage: user.profileImage,
        password: user.password,
        ...tokens,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const register = async (req: Request, res: Response): Promise<Response> => {
  console.log("Register request body:", req.body);

  const { email, fullName, dateOfBirth, password, gender, weight, height, activityLevel, goal } = req.body;
  if (!email || !password || !gender || !weight || !height || !activityLevel || !goal) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send("Email Already Used");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const fileName = path.basename(path.join(__dirname, "default_picture.jpeg"));
    console.log("Default profile picture filename:", fileName);

    const newUser = await User.create({
      email: email,
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      password: encryptedPassword,
      profileImage: fileName,
    });

    const calculateAge = (dob: string) => {
      const diff_ms = Date.now() - new Date(dob).getTime();
      const age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);

    const recommendedCalories = userActivityController.calculateRecommendedCalories(
      gender,
      age,
      weight,
      height,
      activityLevel,
      goal
    );

    if (isNaN(recommendedCalories)) {
      throw new Error("Calculated recommended calories is NaN");
    }

    const userActivity = await UserActivityModel.create({
      user: newUser._id,
      gender: gender,
      age: age,
      currentWeight: weight,
      weightHistory: [{ weight, date: new Date() }],
      height: height,
      activityLevel: activityLevel,
      goal: goal,
      recommendedCalories: recommendedCalories,
      CalorieEaten: 0,
      nutritionValues: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
      createdAt: new Date(),
    });

    const token = await generateTokens(newUser);
    console.log("User registered successfully:", newUser);
    return res.status(201).json({
      email: newUser.email,
      fullName: newUser.fullName,
      dateOfBirth: newUser.dateOfBirth,
      _id: newUser._id,
      password: newUser.password,
      recommendedCalories: userActivity.recommendedCalories,
      ...token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).send("Internal Error - " + error.message);
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
    console.log("user Login", user);

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
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      _id: user._id,
      // profileImage: user.profileImage,
      password: req.body.password,
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

export default {
  register,
  login,
  logout,
  refresh,
  googleSignin,
};
