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
router.get('/:id/getComment/:postId', comment_controller_1.default.getById.bind(comment_controller_1.default));
router.get('/AllComments', comment_controller_1.default.get.bind(comment_controller_1.default));
//POST
router.post('/:id/createComment', auth_middleware_1.default, comment_controller_1.default.post.bind(comment_controller_1.default));
//PUT
router.put('/:id/updateComment/:postId', auth_middleware_1.default, comment_controller_1.default.putById.bind(comment_controller_1.default));
exports.default = router;
//DELETE
router.delete('/:id/deleteComment/:postId', auth_middleware_1.default, comment_controller_1.default.deleteById.bind(comment_controller_1.default));
//# sourceMappingURL=comments_route.js.map