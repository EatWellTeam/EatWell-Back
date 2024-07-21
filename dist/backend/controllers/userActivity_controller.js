"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base_controller");
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
class UserActivityController extends base_controller_1.BaseController {
    constructor() {
        super(userActivity_model_1.default);
    }
    async updateWeight(req, res) {
        try {
            const { userId, weight } = req.body;
            if (!userId || !weight) {
                return res.status(400).json({ message: "User ID and weight are required" });
            }
            const userActivity = await userActivity_model_1.default.findOne({ user: userId });
            if (!userActivity) {
                return res.status(404).json({ message: "User activity not found" });
            }
            userActivity.currentWeight = weight;
            userActivity.weightHistory.push({ weight, date: new Date() });
            await userActivity.save();
            res.status(200).json(userActivity);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async getWeightHistory(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const userActivity = await userActivity_model_1.default.findOne({ user: userId });
            if (!userActivity) {
                return res.status(404).json({ message: "User activity not found" });
            }
            res.status(200).json(userActivity.weightHistory);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async getActivityById(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const userActivity = await userActivity_model_1.default.findOne({ user: userId });
            if (!userActivity) {
                return res.status(404).json({ message: "User activity not found" });
            }
            res.status(200).json(userActivity);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
exports.default = new UserActivityController();
//# sourceMappingURL=userActivity_controller.js.map