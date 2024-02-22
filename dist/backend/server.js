"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const clientKey = process.cwd() + "/client-key.pem";
const clientCert = process.cwd() + "/client-cert.pem";
const port = process.env.PORT || 3001;
const portHttps = process.env.HTTPS_PORT;
(0, app_1.default)().then((app) => {
    const optionSwagger = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2024 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "https://localhost:3000" }],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(optionSwagger);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    if (process.env.NODE_ENV !== "production") {
        console.log("development");
        http_1.default.createServer(app).listen(port);
        console.log(`app is listening to port: ${port}`);
    }
    const options = {
        key: fs_1.default.readFileSync(clientKey),
        cert: fs_1.default.readFileSync(clientCert),
    };
    https_1.default.createServer(options, app).listen(portHttps);
});
//# sourceMappingURL=server.js.map