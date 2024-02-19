"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
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
 *     userActivity: --userActivity id--
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
router.get("/:id/getComment/:postId", comment_controller_1.default.getById.bind(comment_controller_1.default));
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
router.get("/AllComments", comment_controller_1.default.get.bind(comment_controller_1.default));
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
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Post not found to add comment
 *       403:
 *         description: Error in creating object
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
router.post("/:id/createComment", auth_middleware_1.default, comment_controller_1.default.post.bind(comment_controller_1.default));
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
router.put("/:id/updateComment/:postId", auth_middleware_1.default, comment_controller_1.default.putById.bind(comment_controller_1.default));
exports.default = router;
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
 *    400:
 *     description: Post not found to delete comment
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Comment not found
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
router.delete("/:id/deleteComment/:postId", auth_middleware_1.default, comment_controller_1.default.deleteById.bind(comment_controller_1.default));
//# sourceMappingURL=comments_route.js.map