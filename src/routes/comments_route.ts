import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";
import authenticate from "../middleware/auth_middleware";
//GET
// router.get('/:postId/', .getAllPostComments);
router.get('/:id/getComment/:postId', CommentsController.getById.bind(CommentsController));
//POST
router.post('/:id/createComment',authenticate,CommentsController.post.bind(CommentsController));

//PUT
router.put('/:id/updateComment/:postId',authenticate,CommentsController.putById.bind(CommentsController));
export default router;