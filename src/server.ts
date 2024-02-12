import initApp from "./app";
import https from "https";
import http from "http";
import fs from "fs";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
// const path = require("path");

const clientKey = process.cwd() + "/client-key.pem";
const clientCert = process.cwd() + "/client-cert.pem";
const port = process.env.PORT || 3001;
const portHttps = process.env.HTTPS_PORT;
initApp().then((app) => {
  const optionSwagger = {
    definition: {
    openapi: "3.0.0",
    info: {
    title: "Web Dev 2024 REST API",
    version: "1.0.0",
    description: "REST server including authentication using JWT",
    },
    servers: [{url: "http://localhost:3000",},],
    },
    apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(optionSwagger);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));



  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    http.createServer(app).listen(port);
    console.log(`app is listening to port: ${port}`);
  }
  const options = {
    key: fs.readFileSync(clientKey),
    cert: fs.readFileSync(clientCert),
  };
  https.createServer(options, app).listen(portHttps);

});
