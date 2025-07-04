const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // nên lấy từ env để không bị lỗi

const authMiddleware = async (req ,res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({error : 'Khong co token'});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({error : 'Token khong hop le'});
    }
};
module.exports = authMiddleware;