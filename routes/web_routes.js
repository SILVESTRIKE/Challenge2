// routes/web_routes.js
const express = require('express');
const router = express.Router();

// --- Import Controllers ---
const homeController = require('../controllers/homePage_controller');
const webUserController = require('../controllers/web_user_controller');
const webProductController = require('../controllers/web_product_controller');

// --- Import Middlewares ---
const authMiddleware = require('../middlewares/authMiddleware'); // Xác thực cho các trang cần đăng nhập
const adminMiddleware = require('../middlewares/adminMiddleware'); // Phân quyền admin
const checkAuthStatus = require('../middlewares/checkAuthStatus'); // Chỉ kiểm tra status, không chặn

/**
 * =================================================================
 *  HOME & MAIN ROUTES
 * =================================================================
 */
router.get('/', (req, res) => {
    res.redirect('/homePage');
});

// checkAuthStatus cho trang chủ
router.get('/homePage', checkAuthStatus, homeController.getHomePage);

/**
 * =================================================================
 *  AUTHENTICATION & USER ROUTES (WEB PAGES)
 * =================================================================
 */
// Public routes cho ĐK, ĐN, OTP
router.get('/register', webUserController.getCreateUser);
router.post('/register', webUserController.postCreateUser);
router.get('/login', webUserController.getLoginUser);
router.post('/login', webUserController.postLoginUser);

// Logout: Yêu cầu user đã đăng nhập (để chắc chắn)
router.post('/logout', authMiddleware, webUserController.postLogout);

// OTP routes: Public
router.get('/send-otp', webUserController.getSendOtp);
router.post('/send-otp', webUserController.postSendOtp);
router.get('/verify-otp', webUserController.getVerifyOtp);
router.post('/verify-otp', webUserController.postVerifyOtp);

// User Profile: protected by authMiddleware
// Controller sẽ tự kiểm tra quyền (chỉ user đó mới được sửa/xóa profile của mình)
router.get('/profile', authMiddleware, webUserController.getProfile);
router.put('/profile/:id', authMiddleware, webUserController.updateUser);
router.delete('/profile/:id', authMiddleware, webUserController.deleteUser);

/**
 * =================================================================
 *  PRODUCT ROUTES (WEB PAGES & FORMS) - ADDING ROLE RESTRICTIONS
 * =================================================================
 */
// Danh sách sản phẩm: có thể xem bởi mọi người
router.get('/products', checkAuthStatus, webProductController.getAllProducts);

// --- Routes Yêu cầu vai trò ADMIN ---
// Các trang quản lý sản phẩm (tạo, sửa, xóa) yêu cầu đăng nhập VÀ vai trò admin.

// CREATE Product Page & POST
router.get('/product/create', authMiddleware, adminMiddleware('admin'), webProductController.getCreateProductPage);
router.post('/product/createproduct', authMiddleware, adminMiddleware('admin'), webProductController.createProduct);

// EDIT Product Page & PUT
router.get('/product/edit/:id', authMiddleware, adminMiddleware('admin'), webProductController.getUpdateProductPage);
router.put('/product/edit/:id', authMiddleware, adminMiddleware('admin'), webProductController.updateProduct);

// DELETE Product
router.delete('/product/delete/:id', authMiddleware, adminMiddleware('admin'), webProductController.deleteProduct);

// Product Details: Public
router.get('/product/details/:id', checkAuthStatus, webProductController.getProductById);
router.get('/product/slug/:slug', checkAuthStatus, webProductController.getBySlug);

module.exports = router;