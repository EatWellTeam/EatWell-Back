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
}
exports.default = new UserActivityController();
//# sourceMappingURL=userActivity_controller.js.map