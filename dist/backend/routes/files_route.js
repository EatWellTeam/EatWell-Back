"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validPicture_middleware_1 = __importDefault(require("../middleware/validPicture_middleware"));
const upload_middleware_1 = __importDefault(require("../middleware/upload_middleware"));
const router = express_1.default.Router();
const base = "http://localhost:3000";
router.post("/", validPicture_middleware_1.default, upload_middleware_1.default, (req, res) => {
    console.log("router.post");
    if (!req.file) {
        res.status(400).send({ error: "No file uploaded" });
        return;
    }
    else {
        console.log("router.post(/file: " + base + "/public/" + req.file.filename);
        res.status(200).send({ url: base + "/public/" + req.file.filename });
    }
});
exports.default = router;
//# sourceMappingURL=files_route.js.map