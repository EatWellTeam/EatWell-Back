import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/files_route";
import userRoute from "./routes/user_route";
import edamam_route from "./routes/edamam_route";
import path from "path";
import cors from "cors";

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/auth", authRoute);
      app.use("/user", userRoute);
      app.use("/nutrition", edamam_route);
      app.use("/public", express.static(path.join(__dirname, "/public")));
      app.use("/file", fileRoute);

      resolve(app);
    });
  });
  return promise;
};

export default initApp;
