
const userService = require('../services/user_service');
const authService = require('../services/auth_service');

const userMapper = require('../mappers/user_mapper');
const apiUserController = {

    postCreateUser: async (req, res) => {
        try {
            const newUser = await userService.createUser(req.body); // newUser là Mongoose Document            
            const userResponseDTO = userMapper.toUserOutputDTO(newUser);
            res.status(201).json({
                message: 'Tài khoản đã được tạo. OTP đã được gửi đến email của bạn để xác thực.',
                user: userResponseDTO
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
            const userResponseDTO = userMapper.toUserOutputDTO(user); // Map user Document sang DTO
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
        try {
            const result = await userService.sendOtp(req.body.email);
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
        const userResponseDTO = userMapper.toUserOutputDTO(req.user); // Map req.user sang DTO
        res.status(200).json(userResponseDTO);
    },

    updateUser: async (req, res) => {

        try {
            const userId = req.user._id;
            const updatedUser = await userService.updateUser(userId, req.body);
            const updatedUserDTO = userMapper.toUserOutputDTO(updatedUser); // Map sang DTO

            res.status(200).json(updatedUserDTO);
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
            const userDTOs = userMapper.toListUserOutputDTO(users); // Map sang DTOs

            res.status(200).json(userDTOs);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = apiUserController;