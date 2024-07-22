"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
const userActivity_controller_1 = __importDefault(require("../controllers/userActivity_controller"));
const google_auth_library_1 = require("google-auth-library");
const path_1 = __importDefault(require("path"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignin = async (req, res) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("payload", payload);
        const email = payload?.email;
        console.log("email", email);
        if (email != null) {
            let user = await user_model_1.default.findOne({ email: email });
            console.log("find user", user);
            console.log("user picture", payload?.picture);
            if (user == null) {
                user = await user_model_1.default.create({
                    email: email,
                    fullName: payload?.name,
                    dateOfBirth: new Date(),
                    password: "1010",
                    profileImage: payload?.picture,
                });
                console.log("create user", user);
                await userActivity_model_1.default.create({
                    user: user._id,
                    gender: "",
                    age: 0,
                    currentWeight: 0,
                    weightHistory: [],
                    height: 0,
                    activityLevel: "",
                    goal: "",
                    recommendedCalories: 0,
                    nutritionValues: {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                    },
                    createdAt: new Date(),
                });
            }
            const tokens = await generateTokens(user);
            console.log("tokens", tokens);
            res.status(200).send({
                email: user.email,
                _id: user._id,
                profileImage: user.profileImage,
                password: user.password,
                ...tokens,
            });
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
};
const register = async (req, res) => {
    // console.log("register");
    console.log("req.body", req.body);
    const { email, fullName, dateOfBirth, password, gender, age, weight, height, activityLevel, goal } = req.body;
    if (!email || !password || !gender || !weight || !height || !activityLevel || !goal) {
        return res.status(400).send("Missing required fields");
    }
    try {
        const existingUser = await user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send("Email Already Used");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const encryptedPassword = await bcrypt_1.default.hash(password, salt);
        const fileName = path_1.default.basename(path_1.default.join(__dirname, "default_picture.jpeg"));
        console.log("fileName", fileName);
        const newUser = await user_model_1.default.create({
            email: email,
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            password: encryptedPassword,
            profileImage: fileName,
        });
        const recommendedCalories = userActivity_controller_1.default.calculateRecommendedCalories(gender, age, weight, height, activityLevel, goal);
        await userActivity_model_1.default.create({
            user: newUser._id,
            gender: gender,
            age: age,
            currentWeight: weight,
            weightHistory: [{ weight, date: new Date() }],
            height: height,
            activityLevel: activityLevel,
            goal: goal,
            recommendedCalories: recommendedCalories,
            nutritionValues: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
            },
            createdAt: new Date(),
        });
        const token = await generateTokens(newUser);
        return res.status(201).json({
            email: newUser.email,
            fullName: newUser.fullName,
            dateOfBirth: newUser.dateOfBirth,
            _id: newUser._id,
            profileImage: newUser.profileImage,
            password: newUser.password,
            ...token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error - " + error);
    }
};
const generateTokens = async (user) => {
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
    await user.save();
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
const login = async (req, res) => {
    // console.log("login");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await user_model_1.default.findOne({ email: email });
        console.log("user Login", user);
        if (!user) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        const tokens = await generateTokens(user);
        return res.status(200).json({
            email: user.email,
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            _id: user._id,
            profileImage: user.profileImage,
            password: req.body.password,
            ...tokens,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error - " + error);
    }
};
const logout = async (req, res) => {
    // console.log("logout");
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        console.log(err);
        if (err) {
            console.log(err);
            return res.status(402).send(err);
        }
        try {
            const userDb = await user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(200);
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        }
        catch (err) {
            res.sendStatus(403).send(err.message);
        }
    });
};
const refresh = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
};
exports.default = {
    register,
    login,
    logout,
    refresh,
    googleSignin,
};
//# sourceMappingURL=auth_controller.js.map