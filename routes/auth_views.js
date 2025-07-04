const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');

// Giao diện EJS
router.get('/register', (req, res) => res.render('register', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null }));

router.get('/send-otp', (req, res) => {
  res.render('send_otp', { error: null, success: null });
});

router.get('/verify-otp', (req, res) => {
  res.render('verify_otp', {
    error: null,
    success: null,
    email: req.query.email || null
  });
});

// Submit từ form
router.post('/register', controller.createUser);
router.post('/login', controller.getLoginUser);
router.post('/send-otp', controller.sendOtp);
router.post('/verify-otp', controller.verifyOtp);

module.exports = router;
