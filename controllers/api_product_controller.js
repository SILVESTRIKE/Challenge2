const productService = require('../services/product_service');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    }
    catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) return res.status(404).send(err.message);
      res.json(product);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, quantity, slug } = req.body;
      const newProduct = await productService.create({ name, quantity, slug });
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  getBySlug: async (req, res) => {
    try {
      const product = await productService.getBySlug(req.params.slug);
      if (!product) return res.status(404).send(err.message);;
      res.json(product);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const updated = await productService.update(req.params.id, req.body);
      if (!updated) return res.status(404).send(err.message);
      res.json(updated);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  deleteProduct: async (req, res) => {
    const deleted = await productService.delete(req.params.id);
    if (!deleted) return res.status(404).send(err.message);
    res.send('Deleted');
  },
};
module.exports = productController;