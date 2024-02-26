import express from "express";
const router = express.Router();
import { UserController } from "../controllers/user_controller";
import authenticate from "../middleware/auth_middleware";

//TODO:
//1.route to delete user
//2.route to update user password
//3.route to update user picture
//4.route to get all users
//5.route to get user by id

router.delete(
  "/:id",
  authenticate,
  UserController.deleteById.bind(UserController)
);
router.put("/password/:id", userController.updatePassword.bind(userController));

router.put(
  "/picture/:id",
  authenticate,
  userController.updateProfilePicture.bind(userController)
);

router.get("/", authenticate, userController.get.bind(userController));

router.get("/:id", authenticate, userController.getById.bind(userController));

export default router;
