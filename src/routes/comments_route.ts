import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";
import authenticate from "../middleware/auth_middleware";
//GET
// router.get('/:postId/', .getAllPostComments);
router.get('/:commentId/getComment/:postId', CommentsController.getById.bind(CommentsController));
//POST
router.post('/:postId/createComment',authenticate,CommentsController.post.bind(CommentsController));


export default router;