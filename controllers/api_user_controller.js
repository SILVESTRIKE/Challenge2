
const userService = require('../services/user_service');
const authService = require('../services/auth_service');

const apiUserController = {

    postCreateUser: async (req, res) => {
        const { username, email, password } = req.body;
        try {

            const newUser = await userService.createUser({ username, email, password });
            const { password: _, ...userResponse } = newUser.toObject();
            res.status(201).json({
                message: 'Tài khoản đã được tạo. OTP đã được gửi đến email của bạn để xác thực.',
                user: userResponse
            });
        } catch (err) {

            const statusCode = err.message.includes('Email đã tồn tại') ? 409 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    },

    postLoginUser: async (req, res) => {
        const { email, password } = req.body;
        try {

            const { user, accessToken, refreshToken } = await authService.login(email, password);

            res.status(200).json({
                message: 'Đăng nhập thành công!',
                user,
                accessToken,
                refreshToken
            });
        } catch (err) {

            res.status(401).json({ message: err.message });
        }
    },

    postSendOtp: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await userService.sendOtp(email);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body;
        try {
            await userService.verifyOtp(email, otp);
            res.status(200).json({ message: 'Xác thực tài khoản thành công. Bạn có thể đăng nhập.' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    PostLogout: (req, res) => {
        res.status(200).json({ message: 'Đăng xuất thành công. Client nên xóa token.' });
    },

    getProfile: async (req, res) => {

        res.status(200).json(req.user);
    },

    updateUser: async (req, res) => {

        try {
            const userId = req.user._id;
            const updatedUser = await userService.updateUser(userId, req.body);
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    deleteUser: async (req, res) => {

        try {
            const userId = req.user._id;
            await userService.deleteUser(userId);
            res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    getAllUser: async (req, res) => {

        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = apiUserController;