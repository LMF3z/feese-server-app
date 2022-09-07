const express = require('express');
const router = express.Router();
const validateToken = require('../../middlewares/security/validateToken');
const validateServicesMiddleware = require('../../middlewares/services/validateServices.middeware');
const serviceController = require('../../controllers/services/services.controller');
const {
  validateStateMembership,
} = require('../../middlewares/security/validateMembershipState.middleware');

router.post(
  '/add-new-service',
  validateToken.validateToken,
  validateServicesMiddleware.validateRegisterServices,
  validateStateMembership,
  serviceController.createService
);

router.get(
  '/get-services-list',
  validateToken.validateToken,
  serviceController.getServices
);

router.get(
  '/get-services-query',
  validateToken.validateToken,
  serviceController.getAllMatchesServicesController
);

router.put(
  '/update-service',
  validateToken.validateToken,
  validateStateMembership,
  serviceController.updateService
);

router.delete(
  '/delete-service',
  validateToken.validateToken,
  validateStateMembership,
  serviceController.deleteEmployee
);

module.exports = router;
