import express from 'express';
import { saveMeal,getAllUserMeals } from '../controllers/meals_controller';

const router = express.Router();

router.post('/save-meal', saveMeal);
router.get('/:userId', getAllUserMeals);

export default router;