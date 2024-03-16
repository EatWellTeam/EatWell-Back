import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

function validatePicture(req: Request, res: Response, next: NextFunction) {
  // Check if file was uploaded
  if (req.file) {
    const picturePath = req.file.path || req.body.file; // Assuming you're using multer for file uploads

    // Check if file exists
    if (req.file) {
      if (!fs.existsSync(picturePath)) {
        return res.status(400).send("File does not exist");
      }
    }

    // Check if file is an image
    const validImageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
    ];
    const extension = path.extname(picturePath).toLowerCase();
    if (!validImageExtensions.includes(extension)) {
      return res.status(415).send("Invalid file type");
    }

    // If everything is OK, proceed to the next middleware/route handler
  }
  next();
}

export default validatePicture;
