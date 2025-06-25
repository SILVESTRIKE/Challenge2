const express = require('express');
const router = express.Router();
const controller = require('../controllers/product_controller');

router.get('/', controller.getAllProducts);
router.post('/', controller.createProduct);
router.get('/:id', controller.getProductById);
router.get('/slug/:slug', controller.getBySlug);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
