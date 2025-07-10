const Joi = require('joi');

const validateRequestMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            // Trả về lỗi chi tiết cho client nếu validation thất bại
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            console.error("Validation Error:", errorMessage);
            return res.status(400).json({ message: errorMessage });
        }

        req.body = value; // Gán dữ liệu đã validate vào req.body
        next(); // Tiếp tục request
    };
};

module.exports = validateRequestMiddleware;