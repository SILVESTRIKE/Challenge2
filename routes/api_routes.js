const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const authMiddleware = require('../middlewares/auth');
const controllerProduct = require('../controllers/api_product_controller');
const { validateProduct } = require('../middlewares/validate_product');

router.get('/product', controllerProduct.getAllProducts);
router.post('/createproduct', validateProduct, controllerProduct.createProduct);
router.get('/:id', controllerProduct.getProductById);
router.get('/slug/:slug', controllerProduct.getBySlug);
router.put('/:id', validateProduct, controllerProduct.updateProduct);
router.delete('/:id', controllerProduct.deleteProduct);

//API

router.get('/users', controller.getAllUser);
// router.get('/register', controller.getCreateUser);
router.post('/register', controller.postCreateUser);
// router.get('/login', controller.getLoginUser);
router.post('/login', controller.postLoginUser);
// router.get('/send-otp', controller.getSendOtp);
router.post('/send-otp', controller.postSendOtp);
// router.get('/verify-otp', controller.getVerifyOtp);
router.post('/verify-otp', controller.verifyOtp);

router.get('/:id', authMiddleware, controller.getById);
router.get('/email/:email', authMiddleware, controller.getByEmail);
router.put('/:id', authMiddleware, controller.updateUser);
router.delete('/:id', authMiddleware, controller.deleteUser);

module.exports = router;