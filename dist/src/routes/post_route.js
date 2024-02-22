"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
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
 *         - title
 *         - body
 *       properties:
 *         user:
 *           type: string
 *           description: The user id of the post
 *           required: true
 *         title:
 *           type: string
 *           description: The title of the post
 *         body:
 *           type: string
 *           description: The body of the post
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
 *         userActivity: <replace-with-actual-user-id>
 *         title: New Post
 *         body: This is a new post
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
router.get("/allPosts", post_controller_1.default.get.bind(post_controller_1.default));
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
router.get("/:id", post_controller_1.default.getById.bind(post_controller_1.default));
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
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Error in creating object
 *       500:
 *         description: Internal server error
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../public"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//POST
router.post("/addPost", auth_middleware_1.default, upload.single("file"), post_controller_1.default.post.bind(post_controller_1.default));
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
 *       402:
 *         description: User not found
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/like", auth_middleware_1.default, post_controller_1.default.addLike.bind(post_controller_1.default));
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
 *               title:
 *                 type: string
 *                 description: The title of the post
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/update", auth_middleware_1.default, post_controller_1.default.putById.bind(post_controller_1.default));
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
 *       402:
 *         description: Like not found
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */
//DELETE
router.delete("/:id/like", auth_middleware_1.default, post_controller_1.default.deleteLike.bind(post_controller_1.default));
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
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.deleteById.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map