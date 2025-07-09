
const adminMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden: Role '${req.user.role}' is not authorized.` });
        }
        next();
    };
}
module.exports = adminMiddleware;