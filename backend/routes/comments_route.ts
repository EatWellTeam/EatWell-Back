import express from "express";
const router = express.Router();
import CommentsController from "../controllers/comment_controller";
import authenticate from "../middleware/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The comments managing API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *    type: object
 *    required:
 *     - body
 *    properties:
 *     user:
 *      type: string
 *      description: The user id of the comment
 *      required: true
 *     post:
 *      type: string
 *      description: The post id of the comment
 *      required: true
 *     body:
 *      type: string
 *      description: The body of the comment
 *      required: true
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: The date of the creation of the comment
 *    example:
 *     user: --user id--
 *     post: --post id--
 *     body: This is a new comment
 *     createdAt: 2021-08-25T12:00:00.000Z
 */

/**
 * @swagger
 * /posts/comments/{id}/getComment/{postId}:
 *  get:
 *   summary: get the comment by id
 *   description: this route can only be accessed by the registered users.
 *   security:
 *    - bearerAuth: []
 *   tags: [Comments]
 *   responses:
 *    200:
 *     description: The comment description by id
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: The comment id
 *    - in: path
 *      name: postId
 *      required: true
 *      schema:
 *       type: string
 *      description: The post id
 */
//GET
router.get(
  "/:id/getComment/:postId",
  CommentsController.getById.bind(CommentsController)
);

/**
 * @swagger
 * /posts/comments/AllComments:
 *  get:
 *   summary: Get all the comments for post
 *   description: this route can only be accessed by the registered users.
 *   security:
 *    - bearerAuth: []
 *   tags: [Comments]
 *   responses:
 *    200:
 *     description: The list of the comments
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Comment'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal Server Error
 */

router.get("/AllComments", CommentsController.get.bind(CommentsController));

/**
 * @swagger
 *  /posts/comments/{id}/createComment:
 *   post:
 *     summary: create a new comment
 *     description: this route can only be accessed by the registered users.
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: invalid access token
 *       404:
 *         description: User or post not found
 *       500:
 *         description: Internal Server Error
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post id
 */

//POST
router.post(
  "/:id/createComment",
  authenticate,
  CommentsController.post.bind(CommentsController)
);

/**
 * @swagger
 * /posts/comments/{id}/updateComment/{postId}:
 *  put:
 *   summary: update the comment by id
 *   description: this route can only be accessed by the registered users.
 *   security:
 *    - bearerAuth: []
 *   tags: [Comments]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        body:
 *         type: string
 *         description: The body of the comment
 *         required: true
 *         example: "This is an updated comment"
 *   responses:
 *    200:
 *     description: Updated
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *    401:
 *     description: Unauthorized
 *    403:
 *     description: invalid access token
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: The comment id
 *    - in: path
 *      name: postId
 *      required: true
 *      schema:
 *       type: string
 *      description: The post id
 */

//PUT
router.put(
  "/:id/updateComment/:postId",
  authenticate,
  CommentsController.putById.bind(CommentsController)
);
export default router;

/**
 * @swagger
 * /posts/comments/{id}/deleteComment/{postId}:
 *  delete:
 *   summary: delete the comment by id
 *   description: this route can only be accessed by the registered users.
 *   security:
 *    - bearerAuth: []
 *   tags: [Comments]
 *   responses:
 *    200:
 *     description: Deleted successfully
 *    401:
 *     description: Unauthorized
 *    403:
 *     description: invalid access token
 *    404:
 *     description: Post not found to delete comment or comment not found
 *    500:
 *     description: Internal Server Error
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: The comment id
 *    - in: path
 *      name: postId
 *      required: true
 *      schema:
 *       type: string
 *      description: The post id
 */

//DELETE
router.delete(
  "/:id/deleteComment/:postId",
  authenticate,
  CommentsController.deleteById.bind(CommentsController)
);
