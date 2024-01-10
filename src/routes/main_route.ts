import express from "express";
const router = express.Router();
import mainController from "../controllers/main_controller";

router.get("/", mainController.test1);

export default router;
