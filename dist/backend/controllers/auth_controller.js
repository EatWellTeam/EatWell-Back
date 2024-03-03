"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const google_auth_library_1 = require("google-auth-library");
const path_1 = __importDefault(require("path"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ email: email });
            if (user == null) {
                user = yield user_model_1.default.create({
                    email: email,
                    password: "",
                    imgUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                });
            }
            const tokens = yield generateTokens(user);
            res.status(200).send(Object.assign({ email: user.email, _id: user._id, imageUrl: user.profileImage }, tokens));
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("register");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const existingUser = yield user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send("Email Already Used");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const imageUrl = path_1.default.join(__dirname, "default_picture.jpeg");
        const newUser = yield user_model_1.default.create({
            email: email,
            password: encryptedPassword,
            profileImage: imageUrl,
        });
        yield userActivity_model_1.default.create({
            user: newUser._id,
            email: newUser.email,
            post: [],
            comments: [],
            createdAt: new Date(),
        });
        const token = yield generateTokens(newUser);
        return res.status(201).json(Object.assign({ email: newUser.email, _id: newUser._id, profileImage: newUser.profileImage }, token));
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error - " + error);
    }
});
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    }
    else {
        user.refreshTokens.push(refreshToken);
    }
    yield user.save();
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("login");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(401).send("email or password incorrect");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        const tokens = yield generateTokens(user);
        return res.status(200).json(Object.assign({ email: user.email, _id: user._id, profileImage: user.profileImage }, tokens));
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error - " + error);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("logout");
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        if (err) {
            console.log(err);
            return res.status(402).send(err);
        }
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(200);
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
                yield userDb.save();
                return res.sendStatus(200);
            }
        }
        catch (err) {
            res.sendStatus(403).send(err.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            yield userDb.save();
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
// const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
//   console.log("getUserInfo");
//   const authHeader = req.headers["authorization"];
//   const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
//   if (!accessToken) {
//     return res.status(401).send("Unauthorized: Access token is missing");
//   }
//   try {
//     const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {
//       _id: string;
//     };
//     const user = await User.findOne({ _id: decodedToken._id });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     // Customize the user information you want to return
//     const userInfo = {
//       _id: user._id,
//       email: user.email,
//       // Add more user properties as needed
//     };
//     return res.status(200).send(userInfo);
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send("Unauthorized: Invalid access token");
//   }
// };
exports.default = {
    register,
    login,
    logout,
    refresh,
    // getUserInfo, // Add the new method to export
    googleSignin,
};
//# sourceMappingURL=auth_controller.js.map