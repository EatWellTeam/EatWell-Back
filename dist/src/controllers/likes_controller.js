"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const likes_model_1 = __importDefault(require("../models/likes_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const studentController = (0, base_controller_1.default)(likes_model_1.default);
exports.default = studentController;
//# sourceMappingURL=likes_controller.js.map