
const userService = require('../services/user_service');
const authService = require('../services/auth_service');

const webUserController = {

    getCreateUser: (req, res) => {

        res.render('auth/register', { title: 'Register', error: null, oldInput: {} });
    },

    getLoginUser: (req, res) => {

        res.render('auth/login', { title: 'Login', error: null, oldInput: {} });
    },

    getSendOtp: (req, res) => {

        res.render('auth/send_otp', { title: 'Send OTP', error: null });
    },

    getVerifyOtp: (req, res) => {

        const { email } = req.query;
        res.render('auth/verify_otp', { title: 'Verify OTP', error: null, success: null, email: email || '' });
    },

    getProfile: (req, res) => {
        res.render('users/profile', { title: 'My Profile' });
    },

    postCreateUser: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            await userService.createUser({ username, email, password });

            res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err) {

            res.render('auth/register', {
                title: 'Register',
                error: err.message,
                oldInput: { username, email }
            });
        }
    },

    postLoginUser: async (req, res) => {
        const { email, password } = req.body;
        try {

            const { accessToken, refreshToken } = await authService.login(email, password);

            res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            res.redirect('/homePage');
        } catch (err) {

            if (err.message.includes('Tài khoản chưa được xác thực')) {
                return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
            }

            res.render('auth/login', {
                title: 'Login',
                error: err.message,
                oldInput: { email }
            });
        }
    },

    postLogout: (req, res) => {

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.redirect('/homePage');
    },

    postSendOtp: async (req, res) => {
        const { email } = req.body;
        try {
            await userService.sendOtp(email);

            res.render('auth/verify_otp', {
                title: 'Verify OTP',
                error: null,
                success: 'Một OTP mới đã được gửi đến email của bạn.',
                email: email
            });
        } catch (err) {
            res.render('auth/send_otp', { title: 'Send OTP', error: err.message, email: email });
        }
    },

    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body;
        try {
            await userService.verifyOtp(email, otp);

            res.render('auth/login', {
                title: 'Login',
                error: null,
                success: 'Tài khoản đã được xác thực thành công! Vui lòng đăng nhập.',
                oldInput: { email }
            });
        } catch (err) {
            res.render('auth/verify_otp', {
                title: 'Verify OTP',
                error: err.message,
                success: null,
                email: email
            });
        }
    },

    updateUser: async (req, res) => {
        try {

            if (req.user.id !== req.params.id) {
                return res.status(403).send('Bạn không có quyền thực hiện hành động này.');
            }
            await userService.updateUser(req.params.id, req.body);
            res.redirect('/profile');
        } catch (err) {

            res.render('users/profile', {
                title: 'My Profile',
                error: err.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).send('Bạn không có quyền thực hiện hành động này.');
            }
            await userService.deleteUser(req.params.id);

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.redirect('/homePage');
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = webUserController;