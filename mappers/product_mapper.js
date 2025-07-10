// mappers/product_mapper.js
const ProductOutputDTO = require('../DTO/output/ProductDTO'); // <-- Lưu ý đường dẫn này, nếu đúng là ../DTO/output/ProductDTO

const productMapper = {
    toProductOutputDTO: (productDataInput) => {
        if (!productDataInput) {
            return null;
        }

        let productData;
        // Kiểm tra xem đây có phải là Mongoose Document không và gọi .toObject() nếu có
        if (typeof productDataInput.toObject === 'function') {
            productData = productDataInput.toObject();
        } else {
            // Nếu không phải Mongoose Document (có thể đã là plain object), sử dụng trực tiếp
            productData = productDataInput;
        }

        if (!productData._id || !productData.name || !productData.slug || productData.quantity === undefined || productData.price === undefined) {
            console.error("Mapper Error: Missing required fields in product data for DTO.", productData);
            // Trả về null hoặc một DTO rỗng/mặc định nếu thiếu thông tin quan trọng
            return null;
        }

        // Tạo và trả về DTO Output
        return new ProductOutputDTO(
            // productData._id.toString(), // Đảm bảo ID là string
            productData.name,
            productData.slug,
            productData.quantity,
            productData.price,
            // productData.createdAt,
            // productData.updatedAt
        );
    },

    toListProductOutputDTO: (productDocuments) => {
        if (!Array.isArray(productDocuments)) {
            return [];
        }
        // Sử dụng hàm map và mapper để chuyển đổi từng document
        return productDocuments.map(doc => productMapper.toProductOutputDTO(doc));
    }
};

module.exports = productMapper;