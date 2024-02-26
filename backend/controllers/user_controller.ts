//TODO:
//1.delete user
//2.update user
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";

import UserActivity from "../models/userActivity_model";
