const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const controllerProduct = require('../controllers/api_product_controller');
const authMiddleware = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.render('login', { error: null, email: null });
});

// Submit từ form
router.get('/register', controller.getCreateUser);
router.post('/register', controller.postCreateUser);
router.get('/login', controller.getLoginUser);
router.post('/login', controller.postLoginUser);
router.get('/send-otp', controller.getSendOtp);
router.post('/send-otp', controller.postSendOtp);
router.get('/verify-otp', controller.getVerifyOtp);
router.post('/verify-otp', controller.verifyOtp);
router.post('/logout', controller.logout);

router.get('/profile', authMiddleware, controller.getProfile);
router.get('/profile/:id', authMiddleware, controller.getById);
router.get('/profile/email/:email', authMiddleware, controller.getByEmail);
router.put('/profile/:id', authMiddleware, controller.updateUser);
router.delete('/profile/:id', authMiddleware, controller.deleteUser);

router.get('/products', controllerProduct.getAllProducts);


module.exports = router;
