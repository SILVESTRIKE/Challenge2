const productService = require('../services/product_service');

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, slug } = req.body;
    const newProduct = await productService.create({ name, quantity, slug });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const product = await productService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await productService.update(req.params.id, req.body);
    if (!updated) return res.status(404).send('Product not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  const deleted = await productService.delete(req.params.id);
  if (!deleted) return res.status(404).send('Product not found');
  res.send('Deleted');
};