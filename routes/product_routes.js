const express = require('express');
const router = express.Router();
const controller = require('../controllers/product_controller');
const { validateProduct } = require('../middlewares/validate_product');

router.get('/', controller.getAllProducts);
router.post('/', validateProduct, controller.createProduct);
router.get('/:id', controller.getProductById);
router.get('/slug/:slug', controller.getBySlug);
router.put('/:id', validateProduct, controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;