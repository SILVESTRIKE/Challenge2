const authService = require('../services/auth_service');
const authMiddleware = async (req, res, next) => {
    const user = await authService.authenticateUser(req, res);
    if (user) {
        req.user = user;
        res.locals.user = user;
        next();
    } else {
        res.redirect('/login'); // Nếu không xác thực được, bắt đăng nhập
    }
};

module.exports = authMiddleware;