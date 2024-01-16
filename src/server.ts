import initApp from "./app";
import https from "https";
import http from "http";
import fs from "fs";
// const path = require("path");

const clientKey = process.cwd() + "/client-key.pem";
const clientCert = process.cwd() + "/client-cert.pem";
const port = process.env.PORT || 3001;
const portHttps = process.env.HTTPS_PORT;
initApp().then((app) => {
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
