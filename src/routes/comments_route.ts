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
 *     user: 611f4f3f9b3f3e2f3c3f3f3f
 *     post: 611f4f3f9b3f3e2f3c3f3f3f
 *     body: This is a new comment
 *     createdAt: 2021-08-25T12:00:00.000Z
 */

/**
 * @swagger
 * /comments/{id}/getComment/{postId}:
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
router.get('/:id/getComment/:postId', CommentsController.getById.bind(CommentsController));


/**
 * @swagger
 * /comments/AllComments:
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

router.get('/AllComments', CommentsController.get.bind(CommentsController));

/**
 * @swagger
 * /comments/{id}/createComment:
 *  post:
 *   summary: create a new comment
 *   description: this route can only be accessed by the registered users.
 *   security:
 *    - bearerAuth: []
 *   tags: [Comments]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Comment'
 *   responses:
 *    201:
 *     description: Created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *    400:
 *     description: post id is required to add comment
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal Server Error
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: The post id
 */

//POST
router.post('/:id/createComment',authenticate,CommentsController.post.bind(CommentsController));


/**
 * @swagger
 * /comments/{id}/updateComment/{postId}:
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
 *         example:
 *          body: This is an updated comment 
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
router.put('/:id/updateComment/:postId',authenticate,CommentsController.putById.bind(CommentsController));
export default router;

/**
 * @swagger
 * /comments/{id}/deleteComment/{postId}:
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

//DELETE
 router.delete('/:id/deleteComment/:postId',authenticate,CommentsController.deleteById.bind(CommentsController));

