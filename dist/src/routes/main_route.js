"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const main_controller_1 = __importDefault(require("../controllers/main_controller"));
router.get("/", main_controller_1.default.test1);
exports.default = router;
//# sourceMappingURL=main_route.js.map