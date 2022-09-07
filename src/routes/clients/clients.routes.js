const express = require('express');
const router = express.Router();
// * middlewares
const { validateToken } = require('../../middlewares/security/validateToken');
const clientsMiddlawares = require('../../middlewares/clients/clients.middleware');

// * services
const clientsServices = require('../../controllers/clients/clients.controller');
const {
  validateStateMembership,
} = require('../../middlewares/security/validateMembershipState.middleware');

router.post(
  '/create-client',
  validateToken,
  clientsMiddlawares,
  validateStateMembership,
  clientsServices.createClient
);

router.get(
  '/get-client-by-id',
  validateToken,
  clientsServices.getClientByIDController
);

router.get(
  '/get-all-matches-clients',
  validateToken,
  clientsServices.getAllMatchesClientController
);

module.exports = router;
