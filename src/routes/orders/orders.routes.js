const express = require('express');
const router = express.Router();
const validateToken = require('../../middlewares/security/validateToken');
const {
  createOrder,
  getOrderDataByNumControl,
  getOrdersListByRangeDateFromDB,
  annularOrderController,
  getEnableCash,
} = require('../../controllers/orders/orders.controller');
const {
  validateDatePaymentOfEmployeeSelected,
} = require('../../middlewares/orders/orders.middleware');
const {
  validateStateMembership,
} = require('../../middlewares/security/validateMembershipState.middleware');

router.post(
  '/create-order',
  validateToken.validateToken,
  validateDatePaymentOfEmployeeSelected,
  validateStateMembership,
  createOrder
);

router.get(
  '/get-order-data-by-num-control',
  validateToken.validateToken,
  getOrderDataByNumControl
);

router.get(
  '/get-orders-list-by-range-date',
  validateToken.validateToken,
  getOrdersListByRangeDateFromDB
);

router.put(
  '/annular-order-by-id',
  validateToken.validateToken,
  validateStateMembership,
  annularOrderController
);

router.get('/get-enable-cash', validateToken.validateToken, getEnableCash);

module.exports = router;
