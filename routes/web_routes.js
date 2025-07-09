const express = require('express');
const router = express.Router();

// --- Import Controllers for Web Interface ---
const homeController = require('../controllers/homePage_controller');
const webUserController = require('../controllers/web_user_controller');
const webProductController = require('../controllers/web_product_controller');

// --- Import Middlewares đã được chuẩn hóa ---
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const checkAuthStatus = require('../middlewares/checkAuthStatus');

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
// Các route này không cần middleware vì chúng là nơi người dùng đăng nhập/đăng ký
router.get('/register', webUserController.getCreateUser);
router.post('/register', webUserController.postCreateUser);
router.get('/login', webUserController.getLoginUser);
router.post('/login', webUserController.postLoginUser);
router.post('/logout', webUserController.postLogout);
// Các route OTP
router.get('/send-otp', webUserController.getSendOtp);
router.post('/send-otp', webUserController.postSendOtp);
router.get('/verify-otp', webUserController.getVerifyOtp);
router.post('/verify-otp', webUserController.postVerifyOtp);

// User Profile (Protected by authMiddleware)
router.get('/profile', authMiddleware, webUserController.getProfile);
router.put('/profile/:id', authMiddleware, webUserController.updateUser);
router.delete('/profile/:id', authMiddleware, webUserController.deleteUser);

/**
 * =================================================================
 *  PRODUCT ROUTES (WEB PAGES & FORMS)
 * =================================================================
 */
router.get('/products', checkAuthStatus, webProductController.getAllProducts);

// Trang tạo sản phẩm (cần đăng nhập)
router.get('/product/create', authMiddleware, adminMiddleware('admin'), webProductController.getCreateProductPage);

router.post('/product/createproduct', authMiddleware, adminMiddleware('admin'), webProductController.createProduct);
router.get('/product/edit/:id', authMiddleware, adminMiddleware('admin'), webProductController.getUpdateProductPage);
router.put('/product/edit/:id', authMiddleware, adminMiddleware('admin'), webProductController.updateProduct);
router.delete('/product/delete/:id', authMiddleware, adminMiddleware('admin'), webProductController.deleteProduct);

// Trang chi tiết sản phẩm
router.get('/product/details/:id', checkAuthStatus, webProductController.getProductById);
router.get('/product/slug/:slug', checkAuthStatus, webProductController.getBySlug);

module.exports = router;