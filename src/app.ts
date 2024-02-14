import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import mainRoute from "./routes/main_route";
import commentRoute from "./routes/comments_route";
import postRoute from "./routes/post_route";
import userActivityRoute from "./routes/userActivity_route";
// import likeRoute from "./routes/likes_route";


const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(mainRoute);
      app.use("/auth", authRoute);
      app.use("/posts", postRoute);
      app.use("/posts/comments", commentRoute);
      app.use("/user", userActivityRoute);
      // app.use("/likes", likeRoute);


      resolve(app);
    });
  });
  return promise;
};

export default initApp;
