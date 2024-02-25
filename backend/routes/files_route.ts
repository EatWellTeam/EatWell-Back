import express from "express";
import { Callback } from "mongoose";
import multer from "multer";
import { Request } from "express";
import path from "path";
const router = express.Router();
const base = "http://localhost:3000";
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Callback) => {
    console.log("destination: " + path.join(__dirname, "../public"));
    cb(null, path.join(__dirname, "../public"));
  },

  filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  console.log("router.post");
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
    return;
  } else {
    console.log("router.post(/file: " + base + "/public/" + req.file.filename);
    res.status(200).send({ url: base + "/public/" + req.file.filename });
  }
});

export default router;
