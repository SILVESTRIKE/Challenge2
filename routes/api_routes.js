const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/api_user_controller');
const apiProductController = require('../controllers/api_product_controller');
const apiAuthMiddleware = require('../middlewares/apiAuthMiddleware'); // Sử dụng middleware mới
const adminMiddleware = require('../middlewares/adminMiddleware')
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API for user authentication (Register, Login, OTP)
 *   - name: Users
 *     description: API for user management (Protected)
 *   - name: Products
 *     description: API for product management
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         name:
 *           type: string
 *           example: "Laptop Pro"
 *         slug:
 *           type: string
 *           example: "laptop-pro"
 *         quantity:
 *           type: number
 *           example: 50
 *         price:
 *           type: number
 *           example: 1200
 *         description:
 *           type: string
 *           example: "A powerful laptop for professionals."
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - quantity
 *         - price
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         description:
 *           type: string
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         verify:
 *           type: boolean
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

// --- AUTH ROUTES ---

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201: { description: "User registered, OTP sent." }
 *       400: { description: "Missing required fields.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: "Email already exists.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/register', apiUserController.postCreateUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: "Login successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *                 user: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: "Invalid credentials or account not verified.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/login', apiUserController.postLoginUser);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "Logout successful." }
 */
router.post('/logout', apiAuthMiddleware, apiUserController.PostLogout);

/**
 * @swagger
 * /api/send-otp:
 *   post:
 *     summary: Send OTP to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: "OTP sent successfully." }
 *       404: { description: "User not found.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/send-otp', apiUserController.postSendOtp);

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP to activate account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string }
 *     responses:
 *       200: { description: "Account verified successfully." }
 *       400: { description: "Invalid OTP.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/verify-otp', apiUserController.postVerifyOtp);


// --- USER ROUTES ---

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get profile of the currently logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "User profile data.", content: { application/json: { schema: { $ref: '#/components/schemas/UserResponse' } } } }
 *       401: { description: "Unauthorized." }
 */
router.get('/users/me', apiAuthMiddleware, apiUserController.getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "List of users.", content: { application/json: { schema: { type: "array", items: { $ref: '#/components/schemas/UserResponse' } } } } }
 *       401: { description: "Unauthorized." }
 *       403: { description: "Forbidden." }
 */
router.get('/users', apiAuthMiddleware, apiUserController.getAllUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *     responses:
 *       200: { description: "User updated successfully.", content: { application/json: { schema: { $ref: '#/components/schemas/UserResponse' } } } }
 *       401: { description: "Unauthorized." }
 *       403: { description: "Forbidden." }
 *       404: { description: "User not found." }
 */
router.put('/users/:id', apiAuthMiddleware, apiUserController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "User deleted successfully." }
 *       401: { description: "Unauthorized." }
 *       403: { description: "Forbidden." }
 *       404: { description: "User not found." }
 */
router.delete('/users/:id', apiAuthMiddleware, apiUserController.deleteUser);


// --- PRODUCT ROUTES ---

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/products', apiProductController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201: { description: "Product created.", content: { application/json: { schema: { $ref: '#/components/schemas/Product' } } } }
 *       400: { description: "Invalid input.", content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       401: { description: "Unauthorized." }
 */
router.post('/products', apiAuthMiddleware, adminMiddleware('admin'), apiProductController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Product data.", content: { application/json: { schema: { $ref: '#/components/schemas/Product' } } } }
 *       404: { description: "Product not found." }
 */
router.get('/products/:id', apiProductController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200: { description: "Product updated.", content: { application/json: { schema: { $ref: '#/components/schemas/Product' } } } }
 *       400: { description: "Invalid input." }
 *       401: { description: "Unauthorized." }
 *       404: { description: "Product not found." }
 */
router.put('/products/:id', apiAuthMiddleware, adminMiddleware('admin'), apiProductController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Product deleted." }
 *       401: { description: "Unauthorized." }
 *       404: { description: "Product not found." }
 */
router.delete('/products/:id', apiAuthMiddleware, adminMiddleware('admin'), apiProductController.deleteProduct);

module.exports = router;