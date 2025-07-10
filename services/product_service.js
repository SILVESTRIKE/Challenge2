const Product = require('../models/product_model');

const productService = {
    getAll: async () => { return Product.find() },

    getById: async (id) => {
        const product = await Product.findById(id);
        if (!product) throw new Error('Không tìm thấy sản phẩm');
        return product;
    },

    getBySlug: async (slug) => {
        const product = await Product.findOne({ slug });
        if (!product) throw new Error('Không tìm thấy sản phẩm');
        return product;
    },

    create: async (data) => {
        if (!data.name || !data.quantity || !data.slug || !data.price) {
            throw new Error('Vui lòng điền đủ các trường name, quantity, slug');
        }
        const product = new Product(data);
        return await product.save();
    },

    update: async (id, data) => {
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) throw new Error('Không tìm thấy sản phẩm');
        return product;
    },

    delete: async (id) => {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new Error('Không tìm thấy sản phẩm');
        return true;
    },
};

module.exports = productService;