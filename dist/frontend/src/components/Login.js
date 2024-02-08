"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const react_1 = __importStar(require("react"));
require("./login.css");
const google_png_1 = __importDefault(require("../assets/google.png"));
const facebook_png_1 = __importDefault(require("../assets/facebook.png"));
const Login = () => {
    const google = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    };
    const facebook = () => {
        window.open("http://localhost:5000/auth/facebook", "_self");
    };
    const [inputUsername, setInputUsername] = (0, react_1.useState)("");
    const [inputPassword, setInputPassword] = (0, react_1.useState)("");
    const [show, setShow] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        setLoading(true);
        yield delay(500);
        console.log(`Username :${inputUsername}, Password :${inputPassword}`);
        if (inputUsername !== "admin" || inputPassword !== "admin") {
            setShow(true);
        }
        setLoading(false);
    });
    const handlePassword = () => { };
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    return (react_1.default.createElement("div", { className: "login" },
        react_1.default.createElement("h1", { className: "loginTitle" }, "Choose a Login Method"),
        react_1.default.createElement("div", { className: "wrapper" },
            react_1.default.createElement("div", { className: "left" },
                react_1.default.createElement("div", { className: "loginButton google", onClick: google },
                    react_1.default.createElement("img", { src: google_png_1.default, alt: "", className: "icon" }),
                    "Google"),
                react_1.default.createElement("div", { className: "loginButton facebook", onClick: facebook },
                    react_1.default.createElement("img", { src: facebook_png_1.default, alt: "", className: "icon" }),
                    "Facebook")),
            react_1.default.createElement("div", { className: "center" },
                react_1.default.createElement("div", { className: "line" }),
                react_1.default.createElement("div", { className: "or" }, "OR")),
            react_1.default.createElement("div", { className: "right" },
                react_1.default.createElement("input", { type: "text", placeholder: "Username", className: "custom-input", style: { borderRadius: "10px" } }),
                react_1.default.createElement("input", { type: "text", placeholder: "Password", className: "custom-input" }),
                react_1.default.createElement("button", { className: "submit" }, "Login"),
                react_1.default.createElement("button", { className: "submit register" }, "Register")),
            react_1.default.createElement("div", null))));
};
exports.default = Login;
//# sourceMappingURL=Login.js.map