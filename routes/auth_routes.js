const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const authMiddleware = require('../middlewares/auth');
//API

router.get('/', controller.getAllUser);
router.post('/register', controller.createUser);
router.post('/login', controller.getLoginUser);
router.post('/send-otp', controller.sendOtp);
router.post('/verify-otp', controller.verifyOtp);

router.get('/:id', authMiddleware, controller.getById);
router.get('/email/:email', authMiddleware, controller.getByEmail);
router.put('/:id', authMiddleware, controller.updateUser);
router.delete('/:id', authMiddleware, controller.deleteUser);

module.exports = router;