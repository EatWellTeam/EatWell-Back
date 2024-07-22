import express from 'express';
import { saveMeal } from '../controllers/meals_controller';

const router = express.Router();

router.post('/save-meal', saveMeal);

export default router;