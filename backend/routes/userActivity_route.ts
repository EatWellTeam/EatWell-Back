import express from 'express';
import userActivityController from '../controllers/userActivity_controller';

const router = express.Router();

router.put('/updateWeight', userActivityController.updateWeight.bind(userActivityController));
router.get('/weightHistory/:userId', userActivityController.getWeightHistory.bind(userActivityController));
router.get('/', userActivityController.get.bind(userActivityController));
router.get('/:userId', userActivityController. getActivityById.bind(userActivityController));

export default router;