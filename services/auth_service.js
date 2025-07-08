const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('./user_service'); // <<< QUAN TRỌNG: Gọi service bạn bè

const authService = {
    /**
     * Xử lý logic đăng nhập
     */
    login: async (email, password) => {
        // Gọi userService để lấy thông tin user, bao gồm cả password
        const user = await userService.getByEmail(email, true);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Sai mật khẩu');

        if (!user.verify) {
            await userService.sendOtp(user.email).catch(err => console.log(err.message));
            throw new Error('Tài khoản chưa được xác thực. OTP mới đã được gửi đến email của bạn.');
        }

        const accessToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_SECRET, '15m');
        const refreshToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_REFRESH_SECRET, '7d');

        // Trả về user không có password
        const { password: _, ...userWithoutPassword } = user.toObject();
        return { user: userWithoutPassword, accessToken, refreshToken };
    },

    /**
     * Hàm tạo token (chuyển từ user_service qua)
     */
    createToken: (payload, secret, expiresIn) => {
        return jwt.sign(payload, secret, { expiresIn });
    },

    /**
     * Hàm chính để xác thực người dùng từ request (middleware sẽ gọi hàm này)
     * Nó sẽ thử access token trước, nếu thất bại, nó sẽ thử refresh token.
     */
    authenticateUser: async (req, res) => {
        const accessToken = req.cookies.accessToken;

        // 1. Thử xác thực bằng Access Token
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                const user = await userService.getById(decoded.userId);
                if (user) return user;
            } catch (error) {
                // Bỏ qua lỗi, để refresh token xử lý
            }
        }

        // 2. Thử Refresh Token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return null;

        try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userService.getById(decodedRefresh.userId);

            const newAccessToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_SECRET, '15m');
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 15 * 60 * 1000 });

            return user;
        } catch (err) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return null;
        }
    }
};

module.exports = authService;