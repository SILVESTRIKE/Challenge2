const authService = require('../services/auth_service');

const apiAuthMiddleware = async (req, res, next) => {
    // API thường gửi token trong Header, không phải cookie, nhưng chúng ta hỗ trợ cả hai
    const accessToken = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const user = await authService.authenticateUser(req, res);

    if (user) {
        req.user = user;
        next();
    } else {
        // Nếu service không thể xác thực (kể cả sau khi thử refresh), trả về lỗi 401
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
};

module.exports = apiAuthMiddleware;