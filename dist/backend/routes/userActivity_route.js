"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userActivity_controller_1 = __importDefault(require("../controllers/userActivity_controller"));
const router = express_1.default.Router();
router.put('/updateWeight', userActivity_controller_1.default.updateWeight.bind(userActivity_controller_1.default));
router.get('/weightHistory/:userId', userActivity_controller_1.default.getWeightHistory.bind(userActivity_controller_1.default));
router.get('/', userActivity_controller_1.default.get.bind(userActivity_controller_1.default));
router.get('/:userId', userActivity_controller_1.default.getActivityById.bind(userActivity_controller_1.default));
exports.default = router;
//# sourceMappingURL=userActivity_route.js.map