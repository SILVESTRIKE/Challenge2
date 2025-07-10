const UserOutputDTO = require('../DTO/output/UserDTO');

const userMapper = {

    toUserOutputDTO: (userDataInput) => {
        if (!userDataInput) {
            return null;
        }

        let userData;
        // Kiểm tra xem đây có phải là Mongoose Document không và gọi .toObject() nếu có
        if (typeof userDataInput.toObject === 'function') {
            userData = userDataInput.toObject();
        } else {
            // Nếu không phải Mongoose Document (có thể đã là plain object), sử dụng trực tiếp
            userData = userDataInput;
        }

        // Kiểm tra các trường cần thiết trước khi tạo DTO
        if (!userData._id || !userData.username || !userData.email || userData.role === undefined) {
            console.error("Mapper Error: Missing required fields in user data for DTO.", userData);
            return new UserOutputDTO(null, null, null, null, null);
        }

        return new UserOutputDTO(
            // userData._id ? userData._id.toString() : null, // Đảm bảo _id là string và xử lý null
            userData.username,
            userData.email,
            // userData.verify,
            // userData.role
        );
    },

    toListUserOutputDTO: (userDocuments) => {
        if (!Array.isArray(userDocuments)) {
            return [];
        }
        return userDocuments.map(doc => userMapper.toUserOutputDTO(doc));
    }
};

module.exports = userMapper;