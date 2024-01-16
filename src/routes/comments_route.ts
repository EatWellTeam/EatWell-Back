import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";

//GET
// router.get('/:postId/', CommentsController.getAllPostComments);
router.get('/:id/getComment', CommentsController.getCommentById);
//POST
router.post('/:id/createComment',CommentsController.createComment);


export default router;