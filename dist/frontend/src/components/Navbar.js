"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Navbar = ({ user }) => {
    const logout = () => {
        window.open("http://localhost:5000/auth/logout", "_self");
    };
    return (react_1.default.createElement("div", { className: "myNavbar" },
        react_1.default.createElement("span", { className: "logo" },
            react_1.default.createElement(react_router_dom_1.Link, { className: "link", to: "/" }, "AD Social")),
        user ? (react_1.default.createElement("ul", { className: "list" },
            react_1.default.createElement("li", { className: "listItem" },
                react_1.default.createElement("img", { src: user.photos[0].value, alt: "", className: "avatar" })),
            react_1.default.createElement("li", { className: "listItem" }, user.displayName),
            react_1.default.createElement("li", { className: "listItem", onClick: logout }, "Logout"))) : (react_1.default.createElement(react_router_dom_1.Link, { className: "link", to: "" }, "Login"))));
};
exports.default = Navbar;
//# sourceMappingURL=Navbar.js.map