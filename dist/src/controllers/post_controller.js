"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const PostController = (0, base_controller_1.default)(post_model_1.default);
exports.default = PostController;
//# sourceMappingURL=post_controller.js.map