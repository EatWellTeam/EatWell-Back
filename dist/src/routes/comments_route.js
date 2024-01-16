"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
//GET
// router.get('/:postId/', CommentsController.getAllPostComments);
//POST
router.post('/:id/createComment', comment_controller_1.default.createComment);
exports.default = router;
//# sourceMappingURL=comments_route.js.map