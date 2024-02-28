import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthResquest extends Request {
  user?: { _id: string };
}
const authMiddleware = (
  req: AuthResquest,
  res: Response,
  next: NextFunction
) => {
  // console.log("authMiddleware");
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Unauthorized");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user as { _id: string };
    next();
  });
};

export default authMiddleware;
