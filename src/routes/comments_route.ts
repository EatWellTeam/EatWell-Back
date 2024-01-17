import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";
import authenticate from "../middleware/auth_middleware";
//GET
// router.get('/:postId/', .getAllPostComments);
router.get('/:id/getComment/:commentId', CommentsController.getCommentById);
//POST
router.post('/:id/createComment',authenticate,CommentsController.createComment);


export default router;