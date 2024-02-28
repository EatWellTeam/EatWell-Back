"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
* @swagger
*components:
*  schemas:
*    User:
*      type: object
*      required:
*        - email
*        - password
*      properties:
*        email:
*          type: string
*          description: The user's email.
*        password:
*          type: string
*          description: The user's password.
*      example:
*        email: 'bob@gmail.com'
*        password: '123456'

*/
/**
 * @swagger
 * /auth/register:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: User registered successfully.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        400:
 *          description: Missing email or password.
 *        409:
 *          description: Email Already Used.
 *        500:
 *          description: Internal server error.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */
router.post("/register", auth_controller_1.default.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Email or password incorrect.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", auth_controller_1.default.login);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout from the application
 *     tags: [Auth]
 *     description: need to provide the refresh token to logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       401:
 *         description: Unauthorized.
 *       402:
 *         description: Invalid token.
 *       403:
 *         description: Invalid access token.
 */
router.get("/logout", auth_controller_1.default.logout);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: get a new access token using the refresh token
 *     tags: [Auth]
 *     description: need to provide the refresh token to get a new access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The new access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *        description: Unauthorized.

 */
router.get("/refresh", auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_route.js.map