const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middlewares/security/validateToken');
const productsController = require('../../controllers/products/products.controller');
const {
  validateCreateNewProductMiddleware,
} = require('../../middlewares/products/validateNewProductData.middleware');

router.post(
  '/',
  validateToken,
  validateCreateNewProductMiddleware,
  productsController.createNewProductController
);

router.get('/', validateToken, productsController.getAllProductsController);

router.get(
  '/get-product-by-id',
  validateToken,
  productsController.getProductByIdController
);

router.get(
  '/get-product-by-query',
  validateToken,
  productsController.getProductByQueryController
);

router.put('/', validateToken, productsController.updateProductController);

router.delete('/', validateToken, productsController.deleteProductController);

module.exports = router;
