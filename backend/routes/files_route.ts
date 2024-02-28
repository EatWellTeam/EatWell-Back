import express from "express";
import validatePicture from "../middleware/validPicture_middleware";
import upload from "../middleware/upload_middleware";
const router = express.Router();
const base = "http://localhost:3000";

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: The files managing API
 */

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *                 required: true
 *     responses:
 *       200:
 *         description: The file has been uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The url of the uploaded file
 *                   example: "http://localhost:3000/public/163123123123.jpg"
 *       400:
 *         description: No file uploaded or file does not exist
 *       415:
 *         description: Unsupported Media Type
 *       500:
 *         description: Internal server error
 */

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
