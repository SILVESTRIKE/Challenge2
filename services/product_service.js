const Product = require('../models/product_model');

exports.getAll = () => Product.find();

exports.getById = (id) => Product.findById(id);

exports.getBySlug = (slug) => Product.findOne({ slug });

exports.create = (data) => {
  const product = new Product(data);
  return product.save();
};

exports.update = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

exports.delete = (id) => Product.findByIdAndDelete(id);