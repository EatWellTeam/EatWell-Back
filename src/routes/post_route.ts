import express from 'express';
import PostController from '../controllers/post_controller';
const router = express.Router();
//GET
 router.get('/:postId', PostController.getOnePost);
// router.get('/allPosts', PostController.getAllPosts);

 //POST
 router.post('/add-post', PostController.createPost);
//PUT
// router.put('/:postId/update', PostController.updatePost);
//  router.post('/:postId', PostController.toggleLikePost);
//DELETE
// router.delete('/:postId', PostController.deletePost);





//   router.delete('/:postId', PostController.unlikePost);
// // //Comments
//  router.post(':/postId/addComment', PostController.addCommentToPost);
//  router.delete(':/postId/removeComment', PostController.removeCommentFromPost);
export default router;