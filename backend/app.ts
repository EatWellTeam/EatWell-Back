import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import commentRoute from "./routes/comments_route";
import postRoute from "./routes/post_route";
import userActivityRoute from "./routes/userActivity_route";
import fileRoute from "./routes/files_route";
// import userRoute from "./routes/user_route";
import path from "path";
const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();

      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:5173");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        next();
      });
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/auth", authRoute);
      app.use("/posts", postRoute);
      app.use("/posts/comments", commentRoute);
      app.use("/userActivity", userActivityRoute);
      // app.use("/user", userRoute);
      app.use("/public", express.static(path.join(__dirname, "/public")));
      app.use("/file", fileRoute);
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
