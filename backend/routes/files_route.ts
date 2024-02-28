import express from "express";
import validatePicture from "../middleware/validPicture_middleware";
import upload from "../middleware/upload_middleware";
const router = express.Router();
const base = "http://localhost:3000";

router.post("/", validatePicture, upload, (req, res) => {
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
