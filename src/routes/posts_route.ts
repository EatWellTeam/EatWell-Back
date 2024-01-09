import express from 'express';
import PostController from '../controllers/post_controller';
const router = express.Router();

router.get('/', PostController.getById.bind(PostController));
router.get('/all', PostController.getAll.bind(PostController));
router.post('/', PostController.create.bind(PostController));
router.put('/', PostController.update.bind(PostController));
router.delete('/', PostController.delete.bind(PostController));