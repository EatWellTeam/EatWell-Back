import cron from 'node-cron';
import UserActivity from '../models/userActivity_model';

export function scheduleCalorieReset() {
  
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily calorie reset task');
    console.log('Running daily nutritionValue reset task');
    try {
      await UserActivity.updateMany({}, {
        $set: {
          CalorieEaten: 0,
          nutritionValues: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }
        }
      });
    } catch (error) {
      console.error('Error resetting calories:', error);
    }
  });
}