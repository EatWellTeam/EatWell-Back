import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authenticate from "../middleware/auth_middleware";
import validatePicture from "../middleware/validPicture_middleware";
import uploadMiddleware from "../middleware/upload_middleware";
//TODO:
//1.route to delete user
//2.route to update user password
//3.route to update user picture
//4.route to get all users
//5.route to get user by id

router.delete(
  "/:id",
  authenticate,
  userController.deleteById.bind(userController)
);
router.put(
  "/password/:id",
  authenticate,
  userController.updatePassword.bind(userController)
);

router.put(
  "/picture/:id",
  authenticate,
  uploadMiddleware,
  validatePicture,
  userController.updateProfilePicture.bind(userController)
);

router.post(
  "/picture/:id",
  authenticate,
  uploadMiddleware,
  validatePicture,
  userController.postProfilePicture.bind(userController)
);

router.get("/all", authenticate, userController.get.bind(userController));

router.get("/:id", authenticate, userController.getById.bind(userController));

export default router;
