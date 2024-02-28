import express from "express";
import PostController from "../controllers/post_controller";
import authenticate from "../middleware/auth_middleware";
import validatePicture from "../middleware/validPicture_middleware";
import uploadMiddleware from "../middleware/upload_middleware";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         user:
 *           type: string
 *           description: The user id of the post
 *           required: true
 *         body:
 *           type: string
 *           description: The body of the post
 *           required: true
 *         picture:
 *           type: string
 *           description: The picture of the post
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: The comments of the post
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: The likes of the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of the creation of the post
 *       example:
 *         user: <replace-with-actual-user-id>
 *         body: This is a new post
 *         picture: <replace-with-actual-picture-url>
 *         comments: []
 *         likes: []
 *         createdAt: 2021-08-25T12:00:00.000Z
 */

/**
 * @swagger
 * /posts/allPosts:
 *   get:
 *     summary: Returns the list of all the posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     description: This route can only be accessed by the registered users.
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
//GET
router.get("/allPosts", PostController.get.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Posts]
 *     description: Get the post by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id", PostController.getById.bind(PostController));

/**
 * @swagger
 * /posts/addPost:
 *   post:
 *     summary: Create a new post
 *     description: This route requires a Bearer token to be provided in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
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
//POST
router.post(
  "/addPost",
  authenticate,
  uploadMiddleware,
  validatePicture,
  PostController.post.bind(PostController)
);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Add a like to the post
 *     description: This route requires a Bearer token to be provided in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user who liked the post
 *                 required: true
 *                 example: "bob@gmail.com"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The like was successfully added
 *       401:
 *         description: Unauthorized
 *       403:
 *        description: invalid access token
 *       404:
 *         description: User or post not found
 *       409:
 *         description: Post already liked
 *       500:
 *         description: Internal server error
 */

router.post(
  "/:id/like",
  authenticate,
  PostController.addLike.bind(PostController)
);
//PUT

/**
 * @swagger
 * /posts/{id}/update:
 *   put:
 *     summary: Update the post by id
 *     description: This route requires a Bearer token to be provided in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: The body of the post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: file not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: The post was not found
 *       415:
 *         description: Invalid file type
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id/update",
  authenticate,
  uploadMiddleware,
  validatePicture,
  PostController.putById.bind(PostController)
);

/**
 * @swagger
 * /posts/{id}/like:
 *   delete:
 *     summary: Delete the like from the post
 *     description: This route requires a Bearer token to be provided in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user who liked the post
 *                 required: true
 *                 example: "kuku@gmail.com"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The like was successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: Like or post not found
 *       500:
 *         description: Internal server error
 */

//DELETE
router.delete(
  "/:id/like",
  authenticate,
  PostController.deleteLike.bind(PostController)
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete the post by id
 *     description: This route requires a Bearer token to be provided in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post was successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:id",
  authenticate,
  PostController.deleteById.bind(PostController)
);

export default router;
