import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OpenAI
 *   description: The OpenAI API
 */

router.post("/openai", async (req, res) => {
  console.log("openai");
  res.status(200).send({ message: "OpenAI API" });
});
