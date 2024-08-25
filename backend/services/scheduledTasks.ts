import cron from 'node-cron';
import UserActivity from '../models/userActivity_model';

export function scheduleCalorieReset() {
  
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily calorie reset task');
    try {
     
      await UserActivity.updateMany({}, { $set: { CalorieEaten: 0 } });
      console.log('Calorie reset completed successfully');
    } catch (error) {
      console.error('Error resetting calories:', error);
    }
  });
}