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

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         profileImage:
 *           type: string
 *           description: The profile image of the user
 *       example:
 *         email: "username@gmail.com"
 *         password: "password"
 *         profileImage: "profileImage.jpg"
 */

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user
 *     description: Delete user by id
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:id",
  authenticate,
  userController.deleteById.bind(userController)
);

/**
 * @swagger
 * /user/password/{id}:
 *   put:
 *     summary: Update user password
 *     description: Update user password by id
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password
 *                 required: true
 *                 example: "newPassword"
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/password/:id",
  authenticate,
  userController.updatePassword.bind(userController)
);

/**
 * @swagger
 * /user/picture/{id}:
 *   put:
 *     summary: Update user picture
 *     description: Update user picture by id
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture
 *                 required: true
 *     responses:
 *       200:
 *         description: Picture updated
 *       400:
 *        description: file not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: User not found
 *       415:
 *         description: Invalid file type
 *       500:
 *         description: Internal server error
 */

router.put(
  "/picture/:id",
  authenticate,
  uploadMiddleware,
  validatePicture,
  userController.updateProfilePicture.bind(userController)
);

// /**
//  * @swagger
//  * /user/picture/{id}:
//  *   post:
//  *     summary: Add user picture
//  *     description: Add user picture by id
//  *     tags:
//  *       - User
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User id
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: The new profile picture
//  *                 required: true
//  *     responses:
//  *       200:
//  *         description: Picture added
//  *       400:
//  *        description: file not found
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: invalid access token
//  *       404:
//  *         description: User not found
//  *       415:
//  *         description: Invalid file type
//  *       500:
//  *         description: Internal server error
//  */

// router.post(
//   "/picture/:id",
//   authenticate,
//   uploadMiddleware,
//   validatePicture,
//   userController.postProfilePicture.bind(userController)
// );

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users
 *     description: Get all users
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       500:
 *         description: Internal server error
 */

router.get("/all", authenticate, userController.get.bind(userController));

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by id
 *     description: Get user by id
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticate, userController.getById.bind(userController));

export default router;
