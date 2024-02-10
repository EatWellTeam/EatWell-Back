"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const router = express_1.default.Router();
//GET
router.get('/allPosts', post_controller_1.default.get.bind(post_controller_1.default));
router.get('/:id', post_controller_1.default.getById.bind(post_controller_1.default));
//POST 
router.post('/addPost', auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
router.post('/:id/like', auth_middleware_1.default, post_controller_1.default.addLike.bind(post_controller_1.default));
//PUT
router.put('/:id/update', auth_middleware_1.default, post_controller_1.default.putById.bind(post_controller_1.default));
//DELETE
router.delete('/:id/like', auth_middleware_1.default, post_controller_1.default.deleteLike.bind(post_controller_1.default));
router.delete('/:id', auth_middleware_1.default, post_controller_1.default.deleteById.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map