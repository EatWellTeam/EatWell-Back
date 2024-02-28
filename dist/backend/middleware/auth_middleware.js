"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // console.log("authMiddleware");
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).send("Unauthorized");
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(401);
        req.user = user;
        next();
    });
};
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map