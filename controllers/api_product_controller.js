const productService = require('../services/product_service');
const productMapper = require('../mappers/product_mapper'); // Output DTO mapper

const apiProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAll();
      const productDTOs = productMapper.toListProductOutputDTO(products);
      res.json(productDTOs);
    }
    catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) return res.status(404).send(err.message);
      const productDTOs = productMapper.toListProductOutputDTO(products);
      res.json(productDTOs);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  createProduct: async (req, res) => {
    try {
      const newProduct = await productService.create(req.body); // newProduct là Mongoose Document
      const newProductDTO = productMapper.toProductOutputDTO(newProduct); // Map sang DTO
      res.status(201).json(newProductDTO);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  getBySlug: async (req, res) => {
    try {
      const product = await productService.getBySlug(req.params.slug);
      if (!product) return res.status(404).send(err.message);;
      const productDTO = productMapper.toProductOutputDTO(product); // Map sang DTO
      res.json(productDTO);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const updated = await productService.update(req.params.id, req.body);
      if (!updated) return res.status(404).send(err.message);
      const updatedProductDTO = productMapper.toProductOutputDTO(updated); // Map sang DTO
      res.json(updatedProductDTO);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const deleted = await productService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
module.exports = apiProductController;