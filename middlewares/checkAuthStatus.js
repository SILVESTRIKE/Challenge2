const authService = require('../services/auth_service');

const checkAuthStatus = async (req, res, next) => {
    const user = await authService.authenticateUser(req, res);
    res.locals.user = user; // Gán user (hoặc null) vào locals
    next(); // Luôn cho đi tiếp
};

module.exports = checkAuthStatus;