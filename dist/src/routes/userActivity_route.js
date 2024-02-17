"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userActivity_controller_1 = __importDefault(require("../controllers/userActivity_controller"));
// import verifyToken from "../middleware/auth_middleware";
const router = express_1.default.Router();
router.get("/:id", userActivity_controller_1.default.getById.bind(userActivity_controller_1.default));
router.get("/find/all", userActivity_controller_1.default.get.bind(userActivity_controller_1.default));
router.get("/:id/posts", userActivity_controller_1.default.getUserPosts.bind(userActivity_controller_1.default));
router.get("/:id/comments", userActivity_controller_1.default.getUserComments.bind(userActivity_controller_1.default));
// router.put("/:id", verifyToken, userActivityController.updateUserActivity);
exports.default = router;
//# sourceMappingURL=userActivity_route.js.map