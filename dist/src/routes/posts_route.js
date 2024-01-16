"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const base_controller_1 = require("../controllers/base_controller");
const post_model_1 = __importDefault(require("../models/post_model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const postController = new base_controller_1.BaseController(post_model_1.default);
router.get("/posts", auth_middleware_1.default, postController.get.bind(postController));
router.post("/post", auth_middleware_1.default, postController.post.bind(postController));
exports.default = router;
//# sourceMappingURL=posts_route.js.map