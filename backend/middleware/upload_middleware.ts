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

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: Callback) => {
    const validImageMimetypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    if (validImageMimetypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file
      cb(new Error("Invalid file type"), false);
    }
  },
}).single("file");

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: string | Error) => {
    if (err) {
      const message = typeof err === "string" ? err : err.message;
      if (message === "Invalid file type") {
        return res.status(415).json({ error: message });
      } else return res.status(500).json({ error: message });
    }
    next();
  });
};

export default uploadMiddleware;
