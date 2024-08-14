"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userActivitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    currentWeight: { type: Number, required: true },
    weightHistory: [{
            weight: { type: Number, required: true },
            date: { type: Date, required: true }
        }],
    height: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    goal: { type: String, required: true },
    recommendedCalories: { type: Number, required: false },
    CalorieEaten: { type: Number, required: false },
    nutritionValues: {
        calories: { type: Number, required: false },
        protein: { type: Number, required: false },
        carbs: { type: Number, required: false },
        fat: { type: Number, required: false },
    },
    createdAt: { type: Date, default: Date.now },
});
const UserActivityModel = (0, mongoose_1.model)("UserActivity", userActivitySchema);
exports.default = UserActivityModel;
//# sourceMappingURL=userActivity_model.js.map