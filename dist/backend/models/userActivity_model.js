import { Schema, model } from "mongoose";
const userActivitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    goal: { type: String, required: true },
    recommendedCalories: { type: Number, required: false },
    nutritionValues: {
        calories: { type: Number, required: false },
        protein: { type: Number, required: false },
        carbs: { type: Number, required: false },
        fat: { type: Number, required: false },
    },
    createdAt: { type: Date, default: Date.now },
});
const UserActivityModel = model("UserActivity", userActivitySchema);
export default UserActivityModel;
//# sourceMappingURL=userActivity_model.js.map