const {
   createUser,
   loginUser,
   getAllUsers,
   deleteUserById,
   updateUserById,
} = require("../controllers/user");

const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: The password of the user.
 *     responses:
 *       '201':
 *         description: User created successfully.
 *       '400':
 *         description: Validation error. Please check the request body.
 *       '409':
 *         description: Email already in use. Please use a different email.
 *       '500':
 *         description: Internal server error.
 */
router.post("/register", createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: Successful login.
 *       '400':
 *         description: Invalid credentials. Please check your email and password.
 *       '500':
 *         description: Internal server error.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the list of users.
 *       '401':
 *         description: Unauthorized. User ID does not match the JWT token.
 *       '500':
 *         description: Internal server error.
 */
router.get("/", verifyToken, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user by the provided ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: Successfully deleted user.
 *       '401':
 *         description: Unauthorized. User ID does not match the JWT token.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete("/:id", verifyToken, deleteUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user information
 *     description: Updates the information of a user by the provided ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: body
 *         name: user
 *         required: true
 *         description: User information to update
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       '200':
 *         description: User successfully updated.
 *       '401':
 *         description: Unauthorized. User ID does not match the JWT token.
 *       '404':
 *         description: User not found.
 *       '400':
 *         description: Validation error.
 *       '500':
 *         description: Internal server error.
 */
router.patch("/:id", verifyToken, updateUserById);

module.exports = router;
