const Product = require('../models/product_model');
const now =new Date();

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, slug } = req.body;
    const newProduct = new Product({ name, quantity, slug, create_at:now , update_at: now });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
exports.getBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.json(product);
    } catch (err) {
    res.status(400).send(err.message);
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        update_at: now 
      },
      { new: true }
    );
    if (!updated) return res.status(404).send('Product not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).send('Product not found');
  res.send('Deleted');
};
