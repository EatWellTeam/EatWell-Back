"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const base = "http://localhost:3000";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        console.log("destination: " + path_1.default.join(__dirname, "../public"));
        cb(null, path_1.default.join(__dirname, "../public"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/", upload.single("file"), (req, res) => {
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