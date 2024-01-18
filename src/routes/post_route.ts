import express from 'express';
import PostController from '../controllers/post_controller';
import authenticate from '../middleware/auth_middleware';
const router = express.Router();
//GET
router.get('/allPosts', PostController.get.bind(PostController));
 router.get('/:id', PostController.getById.bind(PostController));

 //POST 
 router.post('/addPost',authenticate, PostController.post.bind(PostController));
//PUT
 router.put('/:id/update', authenticate, PostController.putById.bind(PostController));
  // router.put('/:id', PostController.likePost);
//DELETE
router.delete('/:id', authenticate, PostController.deleteById.bind(PostController));

export default router;