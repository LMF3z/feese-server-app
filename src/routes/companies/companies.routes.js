const express = require('express');
const router = express.Router();

// * middlewares
const { validateToken } = require('../../middlewares/security/validateToken');

// * controllers
const companiesControllers = require('../../controllers/companies/companies.controller');
const {
  registerCompanyMembership,
  getLastDatePaymentMembershipController,
} = require('../../controllers/companies/companiesMembership.controller');

router.get(
  '/get-company-data-by-id',
  validateToken,
  companiesControllers.getCompanyByIDFromDb
);

router.put(
  '/update-data-company',
  validateToken,
  companiesControllers.updateDataCompaniesFromDB
);

// * membership

router.post('/update-membership', validateToken, registerCompanyMembership);

router.get(
  '/get-last-date-payment-membership',
  validateToken,
  getLastDatePaymentMembershipController
);

module.exports = router;
