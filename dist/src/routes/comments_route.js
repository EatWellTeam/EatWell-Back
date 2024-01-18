"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
//GET
// router.get('/:postId/', .getAllPostComments);
router.get('/:commentId/getComment/:postId', comment_controller_1.default.getById.bind(comment_controller_1.default));
//POST
router.post('/:postId/createComment', auth_middleware_1.default, comment_controller_1.default.post.bind(comment_controller_1.default));
exports.default = router;
//# sourceMappingURL=comments_route.js.map