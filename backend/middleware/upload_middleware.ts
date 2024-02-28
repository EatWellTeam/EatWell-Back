import multer from "multer";
import path from "path";
import { Callback, Error } from "mongoose";

import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, path.join(__dirname, "../public"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("file");

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: string | Error) => {
    if (err) {
      const message = typeof err === "string" ? err : err.message;
      return res.status(500).json({ error: message });
    }
    next();
  });
};

export default uploadMiddleware;
