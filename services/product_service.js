const Product = require('../models/product_model');

const productService = {
    getAll: async () => { return Product.find() },

    getById: async (id) => {
        const product = await Product.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    },

    getBySlug: async (slug) => {
        const product = await Product.findOne({ slug });
        if (!product) throw new Error('Product not found');
        return product;
    },

    create: async (data) => {
        if (!data.name || !data.quantity || !data.slug) {
            throw new Error('Name, quantity, and slug are required');
        }
        const product = new Product(data);
        return await product.save();
    },

    update: async (id, data) => {
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) throw new Error('Product not found');
        return product;
    },

    delete: async (id) => {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new Error('Product not found');
        return true;
    },
};

module.exports = productService;