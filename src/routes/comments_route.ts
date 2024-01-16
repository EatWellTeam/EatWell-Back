import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";

//GET
// router.get('/:postId/', CommentsController.getAllPostComments);

//POST
router.post('/:postId/createComment',CommentsController.createComment);

