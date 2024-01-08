import initApp from "./app";
import https from "https";
import http from "http";
import fs from "fs";
const path = require("path");

const clientKey = process.cwd() + "/client-key.pem";
const clientCert = process.cwd() + "/client-cert.pem";

initApp().then((app) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    http.createServer(app).listen(process.env.PORT);
  }
  const options = {
    key: fs.readFileSync(clientKey),
    cert: fs.readFileSync(clientCert),
  };
  https.createServer(options, app).listen(process.env.HTTPS_PORT);
});
