import express from "express";
import userActivityController from "../controllers/userActivity_controller";
// import verifyToken from "../middleware/auth_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserActivity
 *   description: The UserActivity managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserActivity:
 *       type: object
 *       required:
 *         - user
 *         - post
 *         - comment
 *         - like
 *       properties:
 *         user:
 *           type: string
 *           description: The user id of the userActivity
 *         post:
 *           type: string
 *           description: The post id of the userActivity
 *         comment:
 *           type: string
 *           description: The comment id of the userActivity
 *         like:
 *           type: string
 *           description: The like id of the userActivity
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of the creation of the userActivity
 *       example:
 *         user: --user id--
 *         post: --post id--
 *         comment: --comment id--
 *         like: --like id--
 *         createdAt: 2021-08-25T12:00:00.000Z
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Returns the userActivity by id
 *     tags: [UserActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The userActivity id
 *     responses:
 *       200:
 *         description: The userActivity description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserActivity'
 *       404:
 *         description: The userActivity was not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", userActivityController.getById.bind(userActivityController));

/**
 * @swagger
 * /user/find/all:
 *   get:
 *     summary: Returns the list of all the userActivity
 *     tags: [UserActivity]
 *     responses:
 *       200:
 *         description: The list of the userActivity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserActivity'
 *       500:
 *         description: Internal server error
 */

router.get(
  "/find/all",
  userActivityController.get.bind(userActivityController)
);

/**
 * @swagger
 * /user/{id}/posts:
 *   get:
 *     summary: Returns the list of all the posts by user id
 *     tags: [UserActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the posts by user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *        description: The user not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id/posts",
  userActivityController.getUserPosts.bind(userActivityController)
);

/**
 * @swagger
 * /user/{id}/comments:
 *   get:
 *     summary: Returns the list of all the comments by user id
 *     tags: [UserActivity]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the comments by user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *        description: The user not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id/comments",
  userActivityController.getUserComments.bind(userActivityController)
);
// router.put("/:id", verifyToken, userActivityController.updateUserActivity);

export default router;
