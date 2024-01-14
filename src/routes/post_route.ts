import express from 'express';
import PostController from '../controllers/post_controller';
const router = express.Router();
//GET
 router.get('/:id', PostController.getOnePost);
 router.get('/allPosts', PostController.getAllPosts);

 //POST
 router.post('/add-post', PostController.createPost);
//PUT
// router.put('/:id/update', PostController.updatePost);
//  router.post('/:id', PostController.toggleLikePost);
//DELETE
// router.delete('/:id', PostController.deletePost);





//   router.delete('/:postId', PostController.unlikePost);
// // //Comments
//  router.post(':/postId/addComment', PostController.addCommentToPost);
//  router.delete(':/postId/removeComment', PostController.removeCommentFromPost);
export default router;