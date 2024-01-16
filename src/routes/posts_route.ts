import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import { BaseController } from "../controllers/base_controller";
import PostModel from "../models/post_model";
import authMiddleware from "../middleware/auth_middleware";

const postController = new BaseController(PostModel);

router.get("/posts", authMiddleware, postController.get.bind(postController));
router.post("/post", authMiddleware, postController.post.bind(postController));

export default router;
