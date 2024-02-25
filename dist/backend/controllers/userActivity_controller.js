"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getUserPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userPosts = yield userActivity_model_1.default.findOne({ user: id }).populate("post");
                if (!userPosts) {
                    res.status(401).json({ message: "User not found" });
                    return;
                }
                res.status(200).json(userPosts.post);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getUserComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userComments = yield userActivity_model_1.default.findOne({ user: id }).populate("comment");
                if (!userComments) {
                    res.status(401).json({ message: "User not found" });
                    return;
                }
                res.status(200).json(userComments.comment);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = new UserActivityController();
//# sourceMappingURL=userActivity_controller.js.map