"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_model_1 = __importDefault(require("../models/comments_model"));
const base_controller_1 = require("./base_controller");
class CommentsController extends base_controller_1.BaseController {
    constructor() {
        super(comments_model_1.default);
    }
}
exports.default = new CommentsController();
//# sourceMappingURL=comment_controller.js.map