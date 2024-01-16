"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import LikesController from "../controllers/likes_controller";
const base_controller_1 = require("../controllers/base_controller");
const likes_model_1 = __importDefault(require("../models/likes_model"));
const likesController = new base_controller_1.BaseController(likes_model_1.default);
router.get("/", likesController.get.bind(likesController));
router.post("/post", likesController.post.bind(likesController));
exports.default = router;
//# sourceMappingURL=likes_route.js.map