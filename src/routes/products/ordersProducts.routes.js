const express = require('express');
const {
  createNewOrderProductsController,
} = require('../../controllers/products/ordersProducts.controller');
const {
  validateCreateNewOrdersProductsMiddleware,
} = require('../../middlewares/products/validateNewOrdersProducts.middleware');
const { validateToken } = require('../../middlewares/security/validateToken');
const router = express.Router();

router.post(
  '/',
  validateToken,
  validateCreateNewOrdersProductsMiddleware,
  createNewOrderProductsController
);

module.exports = router;
