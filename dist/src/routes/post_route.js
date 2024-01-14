"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const router = express_1.default.Router();
//GET
router.get('/allPosts', post_controller_1.default.getAllPosts);
router.get('/:id', post_controller_1.default.getOnePost);
//POST
router.post('/add-post', post_controller_1.default.createPost);
//PUT
router.put('/:id/update', post_controller_1.default.updatePost);
//  router.post('/:id', PostController.toggleLikePost);
//DELETE
// router.delete('/:id', PostController.deletePost);
//   router.delete('/:postId', PostController.unlikePost);
// // //Comments
//  router.post(':/postId/addComment', PostController.addCommentToPost);
//  router.delete(':/postId/removeComment', PostController.removeCommentFromPost);
exports.default = router;
//# sourceMappingURL=post_route.js.map