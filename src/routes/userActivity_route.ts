import express from "express";
import userActivityController from "../controllers/userActivity_controller";
// import verifyToken from "../middleware/auth_middleware";

const router = express.Router();

router.get("/:id", userActivityController.getById.bind(userActivityController));
router.get(
  "/find/all",
  userActivityController.get.bind(userActivityController)
);
router.get(
  "/:id/posts",
  userActivityController.getUserPosts.bind(userActivityController)
);

router.get(
  "/:id/comments",
  userActivityController.getUserComments.bind(userActivityController)
);
// router.put("/:id", verifyToken, userActivityController.updateUserActivity);

export default router;
