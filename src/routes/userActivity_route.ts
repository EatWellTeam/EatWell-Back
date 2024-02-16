import express from "express";
 import userActivityController from "../controllers/userActivity_controller";
 import  verifyToken  from "../middleware/auth_middleware";

const router = express.Router();

 router.get("/:id", verifyToken, userActivityController.getById.bind(userActivityController));
// router.get("/find/all", verifyToken, userActivityController.getAllUserActivity);
// router.put("/:id", verifyToken, userActivityController.updateUserActivity);


export default router;